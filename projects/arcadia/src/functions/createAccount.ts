import { EVM, FunctionOptions, FunctionReturn, toResult } from '@heyanon/sdk';
import { resolveChain } from '../helpers/chains';
import { encodeFunctionData } from 'viem';
import { factoryAbi } from '../abis';
import { FACTORY_ADDRESS } from '../constants';

interface Props {
    chainName: string;
    creditor: string;
}

export async function createAccount({ chainName, creditor }: Props, options: FunctionOptions): Promise<FunctionReturn> {
    const chainId = resolveChain(chainName);
    if (!chainId) {
        return toResult(`Unsupported chain: ${chainName}`, true);
    }

    const { notify, evm } = options;
    const { sendTransactions, getProvider, getAddress } = evm!;
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

    await notify!('Creating Arcadia account...');
    const result = await sendTransactions({ chainId, account, transactions: [tx] });
    const txData = result.data[result.data.length - 1];

    return toResult(`Arcadia account created successfully. ${txData.message}`);
}
