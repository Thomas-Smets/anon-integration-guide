import { EVM, FunctionOptions, FunctionReturn, toResult } from '@heyanon/sdk';
import { resolveChain } from '../helpers/chains';
import { encodeFunctionData, maxUint256, parseUnits } from 'viem';
import { erc20Abi } from '../abis';

interface Props {
    chainName: string;
    tokenAddress: string;
    spender: string;
    amount: string;
}

export async function approve({ chainName, tokenAddress, spender, amount }: Props, options: FunctionOptions): Promise<FunctionReturn> {
    const chainId = resolveChain(chainName);
    if (!chainId) {
        return toResult(`Unsupported chain: ${chainName}`, true);
    }

    const { notify, evm } = options;
    const { sendTransactions, getProvider, getAddress } = evm!;
    const wallet = await getAddress();
    const provider = getProvider(chainId);

    let amountWei: bigint;
    if (amount === 'max') {
        amountWei = maxUint256;
    } else {
        const decimals = await provider.readContract({
            address: tokenAddress as `0x${string}`,
            abi: erc20Abi,
            functionName: 'decimals',
        });
        amountWei = parseUnits(amount, decimals);
    }

    const tx: EVM.types.TransactionParams = {
        target: tokenAddress as `0x${string}`,
        data: encodeFunctionData({
            abi: erc20Abi,
            functionName: 'approve',
            args: [spender as `0x${string}`, amountWei],
        }),
    };

    await notify!(`Approving ${amount} tokens for ${spender}...`);
    const result = await sendTransactions({ chainId, account: wallet, transactions: [tx] });
    const txData = result.data[result.data.length - 1];

    return toResult(`Approved ${amount} of ${tokenAddress} for ${spender}. ${txData.message}`);
}
