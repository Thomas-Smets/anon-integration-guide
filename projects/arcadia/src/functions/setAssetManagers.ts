import { EVM, FunctionOptions, FunctionReturn, toResult } from '@heyanon/sdk';
import { encodeFunctionData } from 'viem';
import { accountAbi } from '../abis';
import { ERC8021_SUFFIX } from '../constants';
import { resolveChain } from '../helpers/chains';

interface Props {
    chainName: string;
    accountAddress: string;
    assetManagers: string[];
    statuses: boolean[];
    datas: string[];
}

export async function setAssetManagers({ chainName, accountAddress, assetManagers, statuses, datas }: Props, options: FunctionOptions): Promise<FunctionReturn> {
    const chainId = resolveChain(chainName);
    if (!chainId) {
        return toResult(`Unsupported chain: ${chainName}`, true);
    }

    if (assetManagers.length !== statuses.length || assetManagers.length !== datas.length) {
        return toResult(`Array lengths must match: assetManagers(${assetManagers.length}), statuses(${statuses.length}), datas(${datas.length})`, true);
    }

    if (assetManagers.length === 0) {
        return toResult('At least one asset manager must be provided', true);
    }

    const { notify, evm } = options;
    const { sendTransactions, getAddress } = evm!;
    const wallet = await getAddress();

    const data = encodeFunctionData({
        abi: accountAbi,
        functionName: 'setAssetManagers',
        args: [assetManagers as `0x${string}`[], statuses, datas as `0x${string}`[]],
    });

    const tx: EVM.types.TransactionParams = {
        target: accountAddress as `0x${string}`,
        data: (data + ERC8021_SUFFIX) as `0x${string}`,
    };

    await notify!(`Setting ${assetManagers.length} asset manager(s)...`);
    const result = await sendTransactions({ chainId, account: wallet, transactions: [tx] });
    const txData = result.data[result.data.length - 1];

    return toResult(`Set ${assetManagers.length} asset manager(s) on ${accountAddress}. ${txData.message}`);
}
