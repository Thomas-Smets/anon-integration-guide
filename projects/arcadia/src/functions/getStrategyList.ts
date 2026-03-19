import { FunctionOptions, FunctionReturn, toResult } from '@heyanon/sdk';
import { resolveChain } from '../helpers/chains';
import { apiGet } from '../helpers/api';

interface Props {
    chainName: string;
}

interface FeaturedStrategy {
    id: number;
    display_name: string;
    protocol: string;
    apy: number;
    numeraire: string;
    leverage: number;
    is_spot: boolean;
}

export async function getStrategyList({ chainName }: Props, _options: FunctionOptions): Promise<FunctionReturn> {
    const chainId = resolveChain(chainName);
    if (!chainId) {
        return toResult(`Unsupported chain: ${chainName}`, true);
    }

    const strategies = await apiGet<FeaturedStrategy[]>('/featured', { chain_id: chainId });

    if (!strategies || strategies.length === 0) {
        return toResult(`No featured strategies found on ${chainName}.`);
    }

    const lines = strategies.map(
        (s) => `- #${s.id}: ${s.display_name} (${s.protocol})\n` + `  APY: ${(s.apy * 100).toFixed(2)}% | ${s.is_spot ? 'Spot' : `Leverage up to ${s.leverage}x`}`,
    );

    return toResult(`Featured LP Strategies on ${chainName}:\n${lines.join('\n')}`);
}
