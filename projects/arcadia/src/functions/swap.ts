import { EVM, FunctionOptions, FunctionReturn, toResult } from '@heyanon/sdk';
import { resolveChain } from '../helpers/chains';
import { parseUnits } from 'viem';
import { erc20Abi } from '../abis';
import { ERC8021_SUFFIX } from '../constants';
import { apiGet } from '../helpers/api';

interface Props {
    chainName: string;
    accountAddress: string;
    tokenFrom: string;
    tokenTo: string;
    amount: string;
}

interface SwapResponse {
    calldata: string;
    fx_call_to: string;
    tenderly_sim_status: string;
}

export async function swap({ chainName, accountAddress, tokenFrom, tokenTo, amount }: Props, options: FunctionOptions): Promise<FunctionReturn> {
    const chainId = resolveChain(chainName);
    if (!chainId) {
        return toResult(`Unsupported chain: ${chainName}`, true);
    }

    const { notify, evm } = options;
    const { sendTransactions, getProvider, getAddress } = evm!;
    const wallet = await getAddress();
    const provider = getProvider(chainId);

    const decimals = await provider.readContract({
        address: tokenFrom as `0x${string}`,
        abi: erc20Abi,
        functionName: 'decimals',
    });
    const amountWei = parseUnits(amount, decimals);
    if (amountWei === 0n) return toResult('Amount must be greater than 0', true);

    await notify!('Building swap transaction...');
    const result = await apiGet<SwapResponse>('/bundles/swap_calldata', {
        amount_in: amountWei.toString(),
        chain_id: chainId,
        account_address: accountAddress,
        asset_from: tokenFrom,
        asset_to: tokenTo,
        slippage: 100,
    });

    if (result.tenderly_sim_status === 'false') {
        return toResult('Swap simulation failed. Verify the account holds enough of the source token.', true);
    }

    const calldata = (result.calldata + ERC8021_SUFFIX) as `0x${string}`;
    const tx: EVM.types.TransactionParams = {
        target: result.fx_call_to as `0x${string}`,
        data: calldata,
    };

    await notify!('Waiting for transaction confirmation...');
    const txResult = await sendTransactions({ chainId, account: wallet, transactions: [tx] });
    const txData = txResult.data[txResult.data.length - 1];

    return toResult(`Swapped ${amount} tokens in ${accountAddress}. ${txData.message}`);
}
