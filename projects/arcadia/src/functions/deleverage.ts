import { EVM, FunctionOptions, FunctionReturn, toResult } from '@heyanon/sdk';
import { resolveChain } from '../helpers/chains';
import { parseUnits } from 'viem';
import { erc20Abi, accountAbi } from '../abis';
import { ERC8021_SUFFIX } from '../constants';
import { apiGet } from '../helpers/api';

interface Props {
    chainName: string;
    accountAddress: string;
    tokenFrom: string;
    amount: string;
}

interface RepayResponse {
    calldata: string;
    fx_call_to: string;
    tenderly_sim_status: string;
}

export async function deleverage({ chainName, accountAddress, tokenFrom, amount }: Props, options: FunctionOptions): Promise<FunctionReturn> {
    const chainId = resolveChain(chainName);
    if (!chainId) {
        return toResult(`Unsupported chain: ${chainName}`, true);
    }

    const { notify, evm } = options;
    const { sendTransactions, getProvider, getAddress } = evm!;
    const wallet = await getAddress();
    const provider = getProvider(chainId);

    // Read account's creditor and numeraire on-chain
    const [creditor, numeraire] = await Promise.all([
        provider.readContract({
            address: accountAddress as `0x${string}`,
            abi: accountAbi,
            functionName: 'creditor',
        }),
        provider.readContract({
            address: accountAddress as `0x${string}`,
            abi: accountAbi,
            functionName: 'numeraire',
        }),
    ]);

    if (!creditor || creditor === '0x0000000000000000000000000000000000000000') {
        return toResult('This is a spot account with no debt. Deleverage is not applicable.', true);
    }

    const decimals = await provider.readContract({
        address: tokenFrom as `0x${string}`,
        abi: erc20Abi,
        functionName: 'decimals',
    });
    const amountWei = parseUnits(amount, decimals);
    if (amountWei === 0n) return toResult('Amount must be greater than 0', true);

    await notify!('Building deleverage transaction...');
    const result = await apiGet<RepayResponse>('/bundles/repay_calldata', {
        amount_in: amountWei.toString(),
        chain_id: chainId,
        account_address: accountAddress,
        asset_from: tokenFrom,
        numeraire,
        creditor,
        slippage: 100,
    });

    if (result.tenderly_sim_status === 'false') {
        return toResult('Deleverage simulation failed. Verify the account holds enough collateral.', true);
    }

    const calldata = (result.calldata + ERC8021_SUFFIX) as `0x${string}`;
    const tx: EVM.types.TransactionParams = {
        target: result.fx_call_to as `0x${string}`,
        data: calldata,
    };

    await notify!('Waiting for transaction confirmation...');
    const txResult = await sendTransactions({ chainId, account: wallet, transactions: [tx] });
    const txData = txResult.data[txResult.data.length - 1];

    return toResult(`Deleveraged ${amount} from ${accountAddress}. ${txData.message}`);
}
