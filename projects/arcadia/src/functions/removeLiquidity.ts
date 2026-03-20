import { EVM, FunctionOptions, FunctionReturn, toResult } from '@heyanon/sdk';
import { resolveChain } from '../helpers/chains';
import { ERC8021_SUFFIX } from '../constants';
import { apiGet } from '../helpers/api';

interface Props {
    chainName: string;
    accountAddress: string;
    assetAddress: string;
    assetId: number;
    adjustment: string;
}

interface DecreaseResponse {
    calldata: string;
    fx_call_to: string;
    tenderly_sim_status: string;
}

/**
 * Partially decreases liquidity from an existing LP position.
 *
 * @param props - Function parameters
 * @param options - SDK function options (provider, signer, notifications)
 * @returns Result with transaction status and details
 */
export async function removeLiquidity({ chainName, accountAddress, assetAddress, assetId, adjustment }: Props, options: FunctionOptions): Promise<FunctionReturn> {
    const chainId = resolveChain(chainName);
    if (!chainId) {
        return toResult(`Unsupported chain: ${chainName}`, true);
    }

    const { notify, evm } = options;
    const { sendTransactions, getAddress } = evm;
    const wallet = await getAddress();

    await notify('Building remove liquidity transaction...');
    const result = await apiGet<DecreaseResponse>('/bundles/decrease_liquidity', {
        chain_id: chainId,
        account_address: accountAddress,
        asset: assetAddress,
        position_id: assetId,
        adjustment,
    });

    if (result.tenderly_sim_status === 'false') {
        return toResult('Transaction simulation failed. Verify the position exists with getAccountInfo.', true);
    }

    const calldata = (result.calldata + ERC8021_SUFFIX) as `0x${string}`;
    const tx: EVM.types.TransactionParams = {
        target: result.fx_call_to as `0x${string}`,
        data: calldata,
    };

    try {
        await notify('Waiting for transaction confirmation...');
        const txResult = await sendTransactions({ chainId, account: wallet, transactions: [tx] });
        const txData = txResult.data[txResult.data.length - 1];
        if ('isMultisig' in txResult && txResult.isMultisig) {
            return toResult(txData.message);
        }
        return toResult(`Removed liquidity from position #${assetId}. ${txData.message}`);
    } catch (error) {
        return toResult(`Failed to remove liquidity: ${error instanceof Error ? error.message : 'Unknown error'}`, true);
    }
}
