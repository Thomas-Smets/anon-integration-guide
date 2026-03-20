import { EVM, FunctionOptions, FunctionReturn, toResult } from '@heyanon/sdk';
import { resolveChain } from '../helpers/chains';
import { encodeFunctionData, parseUnits } from 'viem';
import { accountAbi, erc20Abi } from '../abis';

interface Props {
    chainName: string;
    accountAddress: string;
    tokenAddress: string;
    amount: string;
}

/**
 * Withdraws ERC20 tokens from an Arcadia account to the wallet.
 *
 * @param props - Function parameters
 * @param options - SDK function options (provider, signer, notifications)
 * @returns Result with transaction status and details
 */
export async function withdraw({ chainName, accountAddress, tokenAddress, amount }: Props, options: FunctionOptions): Promise<FunctionReturn> {
    const chainId = resolveChain(chainName);
    if (!chainId) {
        return toResult(`Unsupported chain: ${chainName}`, true);
    }

    const { notify, evm } = options;
    const { sendTransactions, getProvider, getAddress } = evm;
    const wallet = await getAddress();
    const provider = getProvider(chainId);

    const decimals = await provider.readContract({
        address: tokenAddress as `0x${string}`,
        abi: erc20Abi,
        functionName: 'decimals',
    });

    const amountWei = parseUnits(amount, decimals);
    if (amountWei === 0n) return toResult('Amount must be greater than 0', true);

    const tx: EVM.types.TransactionParams = {
        target: accountAddress as `0x${string}`,
        data: encodeFunctionData({
            abi: accountAbi,
            functionName: 'withdraw',
            args: [[tokenAddress as `0x${string}`], [0n], [amountWei]],
        }),
    };

    try {
        await notify(`Withdrawing ${amount} tokens from Arcadia account...`);
        const result = await sendTransactions({ chainId, account: wallet, transactions: [tx] });
        const txData = result.data[result.data.length - 1];
        if ('isMultisig' in result && result.isMultisig) {
            return toResult(txData.message);
        }
        return toResult(`Withdrew ${amount} tokens from ${accountAddress}. ${txData.message}`);
    } catch (error) {
        return toResult(`Failed to withdraw: ${error instanceof Error ? error.message : 'Unknown error'}`, true);
    }
}
