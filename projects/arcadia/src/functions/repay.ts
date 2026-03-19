import { EVM, FunctionOptions, FunctionReturn, toResult } from '@heyanon/sdk';
import { resolveChain } from '../helpers/chains';

const { checkToApprove } = EVM.utils;
import { encodeFunctionData, parseUnits } from 'viem';
import { poolAbi, erc20Abi } from '../abis';

interface Props {
    chainName: string;
    accountAddress: string;
    poolAddress: string;
    amount: string;
}

export async function repay({ chainName, accountAddress, poolAddress, amount }: Props, options: FunctionOptions): Promise<FunctionReturn> {
    const chainId = resolveChain(chainName);
    if (!chainId) {
        return toResult(`Unsupported chain: ${chainName}`, true);
    }

    const { notify, evm } = options;
    const { sendTransactions, getProvider, getAddress } = evm!;
    const wallet = await getAddress();
    const provider = getProvider(chainId);

    const decimals = await provider.readContract({
        address: poolAddress as `0x${string}`,
        abi: erc20Abi,
        functionName: 'decimals',
    });

    const amountWei = parseUnits(amount, decimals);
    if (amountWei === 0n) return toResult('Amount must be greater than 0', true);

    const transactions: EVM.types.TransactionParams[] = [];

    // Pool's underlying token is the pool itself (ERC4626-like), approve pool to pull tokens
    await checkToApprove({
        args: {
            account: wallet,
            target: poolAddress as `0x${string}`,
            spender: poolAddress as `0x${string}`,
            amount: amountWei,
        },
        transactions,
        provider,
    });

    transactions.push({
        target: poolAddress as `0x${string}`,
        data: encodeFunctionData({
            abi: poolAbi,
            functionName: 'repay',
            args: [amountWei, accountAddress as `0x${string}`],
        }),
    });

    await notify!(`Repaying ${amount} to lending pool...`);
    const result = await sendTransactions({ chainId, account: wallet, transactions });
    const txData = result.data[result.data.length - 1];

    return toResult(`Repaid ${amount} to ${poolAddress} for account ${accountAddress}. ${txData.message}`);
}
