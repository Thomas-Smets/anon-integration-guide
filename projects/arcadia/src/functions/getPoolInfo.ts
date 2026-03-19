import { FunctionOptions, FunctionReturn, toResult } from '@heyanon/sdk';
import { resolveChain } from '../helpers/chains';
import { apiGet } from '../helpers/api';

interface Props {
    chainName: string;
    poolAddress: string;
}

export async function getPoolInfo({ chainName, poolAddress }: Props, _options: FunctionOptions): Promise<FunctionReturn> {
    const chainId = resolveChain(chainName);
    if (!chainId) {
        return toResult(`Unsupported chain: ${chainName}`, true);
    }

    if (!poolAddress) return toResult('poolAddress is required', true);

    const data = await apiGet<unknown>('/pools_data', {
        chain_id: chainId,
        pool_address: poolAddress,
    });

    return toResult(`Pool data for ${poolAddress}:\n${JSON.stringify(data, null, 2)}`);
}
