import { FunctionOptions, FunctionReturn, toResult } from '@heyanon/sdk';
import { resolveChain } from '../helpers/chains';
import { apiGet } from '../helpers/api';

interface Props {
    chainName: string;
}

interface Pool {
    name: string;
    address: string;
    apy: number;
    utilisation: number;
    total_realised_liquidity_usd: number;
}

export async function getPoolList({ chainName }: Props, _options: FunctionOptions): Promise<FunctionReturn> {
    const chainId = resolveChain(chainName);
    if (!chainId) {
        return toResult(`Unsupported chain: ${chainName}`, true);
    }

    const pools = await apiGet<Pool[]>('/pools', { chain_id: chainId });

    if (!pools || pools.length === 0) {
        return toResult(`No lending pools found on ${chainName}.`);
    }

    const lines = pools.map(
        (p) =>
            `- ${p.name} Pool (${p.address})\n` +
            `  APY: ${(p.apy * 100).toFixed(2)}% | Util: ${(p.utilisation * 100).toFixed(1)}% | TVL: $${(p.total_realised_liquidity_usd / 1e6).toFixed(2)}M`,
    );

    return toResult(`Arcadia Lending Pools on ${chainName}:\n${lines.join('\n')}`);
}
