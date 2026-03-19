import { EVM, FunctionOptions, FunctionReturn, toResult } from '@heyanon/sdk';
import { resolveChain } from '../helpers/chains';
import { encodeFunctionData, parseUnits } from 'viem';
import { poolAbi, erc20Abi } from '../abis';

interface Props {
    chainName: string;
    accountAddress: string;
    poolAddress: string;
    amount: string;
}

export async function borrow({ chainName, accountAddress, poolAddress, amount }: Props, options: FunctionOptions): Promise<FunctionReturn> {
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

    const tx: EVM.types.TransactionParams = {
        target: poolAddress as `0x${string}`,
        data: encodeFunctionData({
            abi: poolAbi,
            functionName: 'borrow',
            args: [amountWei, accountAddress as `0x${string}`, wallet, '0x000000' as `0x${string}`],
        }),
    };

    await notify!(`Borrowing ${amount} from lending pool...`);
    const result = await sendTransactions({ chainId, account: wallet, transactions: [tx] });
    const txData = result.data[result.data.length - 1];

    return toResult(`Borrowed ${amount} from ${poolAddress}. ${txData.message}`);
}
