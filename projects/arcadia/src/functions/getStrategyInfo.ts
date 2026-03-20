import { FunctionOptions, FunctionReturn, toResult } from '@heyanon/sdk';
import { resolveChain } from '../helpers/chains';
import { apiGet } from '../helpers/api';

interface Props {
    chainName: string;
    strategyId: number;
}

interface StrategyInfo {
    pool_address: string;
    sqrt_ratio_x96: string;
    current_tick: number;
    current_tick_float: number;
    ranges: Record<string, unknown>;
}

/**
 * Retrieves detailed info for a specific LP strategy.
 *
 * @param props - Function parameters
 * @param options - SDK function options (provider, signer, notifications)
 * @returns Result with formatted strategy data
 */
export async function getStrategyInfo({ chainName, strategyId }: Props, _options: FunctionOptions): Promise<FunctionReturn> {
    const chainId = resolveChain(chainName);
    if (!chainId) {
        return toResult(`Unsupported chain: ${chainName}`, true);
    }

    const data = await apiGet<StrategyInfo>(`/strategies/${strategyId}/info`, { chain_id: chainId });

    const lines = [`Strategy #${strategyId} Info:`, `Pool: ${data.pool_address}`, `Current Tick: ${data.current_tick_float}`];

    if (data.ranges) {
        const rangeEntries = Object.entries(data.ranges).slice(0, 5);
        for (const [key, value] of rangeEntries) {
            const r = value as Record<string, unknown>;
            lines.push(`Range ${key}: lower=${r.lower_tick ?? r.tick_lower ?? 'N/A'}, upper=${r.upper_tick ?? r.tick_upper ?? 'N/A'}, weight=${r.weight ?? 'N/A'}`);
        }
        if (Object.keys(data.ranges).length > 5) {
            lines.push(`... and ${Object.keys(data.ranges).length - 5} more ranges`);
        }
    }

    return toResult(lines.join('\n'));
}
