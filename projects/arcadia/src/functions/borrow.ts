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

/**
 * Borrows tokens from an Arcadia lending pool against account collateral.
 *
 * @param props - Function parameters
 * @param options - SDK function options (provider, signer, notifications)
 * @returns Result with transaction status and details
 */
export async function borrow({ chainName, accountAddress, poolAddress, amount }: Props, options: FunctionOptions): Promise<FunctionReturn> {
    const chainId = resolveChain(chainName);
    if (!chainId) {
        return toResult(`Unsupported chain: ${chainName}`, true);
    }

    const { notify, evm } = options;
    const { sendTransactions, getProvider, getAddress } = evm;
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

    try {
        await notify(`Borrowing ${amount} from lending pool...`);
        const result = await sendTransactions({ chainId, account: wallet, transactions: [tx] });
        const txData = result.data[result.data.length - 1];
        if ('isMultisig' in result && result.isMultisig) {
            return toResult(txData.message);
        }
        return toResult(`Borrowed ${amount} from ${poolAddress}. ${txData.message}`);
    } catch (error) {
        return toResult(`Failed to borrow: ${error instanceof Error ? error.message : 'Unknown error'}`, true);
    }
}
