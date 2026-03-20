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

/**
 * Lists featured LP strategies on Arcadia with APY and pool details.
 *
 * @param props - Function parameters
 * @param options - SDK function options (provider, signer, notifications)
 * @returns Result with formatted strategy list data
 */
export async function getStrategyList({ chainName }: Props, _options: FunctionOptions): Promise<FunctionReturn> {
    const chainId = resolveChain(chainName);
    if (!chainId) {
        return toResult(`Unsupported chain: ${chainName}`, true);
    }

    const strategies = await apiGet<FeaturedStrategy[]>('/featured', { chain_id: chainId });

    if (!strategies || strategies.length === 0) {
        return toResult(`No featured strategies found on ${chainName}.`);
    }

    const shown = strategies.slice(0, 10);
    const lines = shown.map(
        (s) => `- #${s.id}: ${s.display_name} (${s.protocol})\n` + `  APY: ${(s.apy * 100).toFixed(2)}% | ${s.is_spot ? 'Spot' : `Leverage up to ${s.leverage}x`}`,
    );
    const suffix = strategies.length > 10 ? `\n... and ${strategies.length - 10} more strategies` : '';

    return toResult(`Featured LP Strategies on ${chainName} (${strategies.length} total):\n${lines.join('\n')}${suffix}`);
}
