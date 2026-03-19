import { FunctionOptions, FunctionReturn, toResult } from '@heyanon/sdk';
import { resolveChain } from '../helpers/chains';
import { apiGet } from '../helpers/api';

interface Props {
    chainName: string;
    accountAddress: string;
}

export async function getStrategyRecommendation({ chainName, accountAddress }: Props, _options: FunctionOptions): Promise<FunctionReturn> {
    const chainId = resolveChain(chainName);
    if (!chainId) {
        return toResult(`Unsupported chain: ${chainName}`, true);
    }

    if (!accountAddress) return toResult('accountAddress is required', true);

    const data = await apiGet<unknown>('/recommendation', {
        chain_id: chainId,
        account: accountAddress,
    });

    return toResult(`Recommendation for ${accountAddress}:\n${JSON.stringify(data, null, 2)}`);
}
