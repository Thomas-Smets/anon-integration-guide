import { EVM, FunctionOptions, FunctionReturn, toResult } from '@heyanon/sdk';
import { resolveChain } from '../helpers/chains';
import { encodeFunctionData } from 'viem';
import { factoryAbi } from '../abis';
import { FACTORY_ADDRESS } from '../constants';

interface Props {
    chainName: string;
    creditor: string;
}

/**
 * Creates a new Arcadia account (margin or spot) via the Factory contract.
 *
 * @param props - Function parameters
 * @param options - SDK function options (provider, signer, notifications)
 * @returns Result with transaction status and details
 */
export async function createAccount({ chainName, creditor }: Props, options: FunctionOptions): Promise<FunctionReturn> {
    const chainId = resolveChain(chainName);
    if (!chainId) {
        return toResult(`Unsupported chain: ${chainName}`, true);
    }

    const { notify, evm } = options;
    const { sendTransactions, getProvider, getAddress } = evm;
    const account = await getAddress();
    const provider = getProvider(chainId);

    const latestVersion = await provider.readContract({
        address: FACTORY_ADDRESS,
        abi: factoryAbi,
        functionName: 'latestAccountVersion',
    });

    const salt = Math.floor(Math.random() * 2 ** 32);

    const tx: EVM.types.TransactionParams = {
        target: FACTORY_ADDRESS,
        data: encodeFunctionData({
            abi: factoryAbi,
            functionName: 'createAccount',
            args: [salt, BigInt(latestVersion), creditor as `0x${string}`],
        }),
    };

    try {
        await notify('Creating Arcadia account...');
        const result = await sendTransactions({ chainId, account, transactions: [tx] });
        const txData = result.data[result.data.length - 1];
        if ('isMultisig' in result && result.isMultisig) {
            return toResult(txData.message);
        }
        return toResult(`Arcadia account created successfully. ${txData.message}`);
    } catch (error) {
        return toResult(`Failed to create account: ${error instanceof Error ? error.message : 'Unknown error'}`, true);
    }
}
