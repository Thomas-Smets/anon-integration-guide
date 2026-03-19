import { EVM, FunctionOptions, FunctionReturn, toResult } from '@heyanon/sdk';
import { resolveChain } from '../helpers/chains';
import { ERC8021_SUFFIX } from '../constants';
import { apiGet } from '../helpers/api';

interface Props {
    chainName: string;
    accountAddress: string;
    action: string;
    assetAddress: string;
    assetId: number;
}

interface StakeResponse {
    calldata: string;
    fx_call_to: string;
    tenderly_sim_status: string;
}

export async function stake({ chainName, accountAddress, action, assetAddress, assetId }: Props, options: FunctionOptions): Promise<FunctionReturn> {
    const chainId = resolveChain(chainName);
    if (!chainId) {
        return toResult(`Unsupported chain: ${chainName}`, true);
    }

    if (!['stake', 'unstake', 'claim'].includes(action)) {
        return toResult(`Invalid action: ${action}. Must be stake, unstake, or claim.`, true);
    }

    const { notify, evm } = options;
    const { sendTransactions, getAddress } = evm!;
    const wallet = await getAddress();

    const endpoint = action === 'claim' ? '/bundles/claim' : '/bundles/stake';

    await notify!(`Building ${action} transaction...`);
    const result = await apiGet<StakeResponse>(endpoint, {
        chain_id: chainId,
        account_address: accountAddress,
        asset: assetAddress,
        position_id: assetId,
    });

    if (result.tenderly_sim_status === 'false') {
        return toResult('Transaction simulation failed. Verify the position exists with getAccountInfo.', true);
    }

    const calldata = (result.calldata + ERC8021_SUFFIX) as `0x${string}`;
    const tx: EVM.types.TransactionParams = {
        target: result.fx_call_to as `0x${string}`,
        data: calldata,
    };

    await notify!('Waiting for transaction confirmation...');
    const txResult = await sendTransactions({ chainId, account: wallet, transactions: [tx] });
    const txData = txResult.data[txResult.data.length - 1];

    const labels: Record<string, string> = { stake: 'Staked', unstake: 'Unstaked', claim: 'Claimed rewards for' };
    return toResult(`${labels[action]} position #${assetId}. ${txData.message}`);
}
