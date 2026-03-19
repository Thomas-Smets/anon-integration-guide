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

export async function getStrategyInfo({ chainName, strategyId }: Props, _options: FunctionOptions): Promise<FunctionReturn> {
    const chainId = resolveChain(chainName);
    if (!chainId) {
        return toResult(`Unsupported chain: ${chainName}`, true);
    }

    const data = await apiGet<StrategyInfo>(`/strategies/${strategyId}/info`, { chain_id: chainId });

    const lines = [`Strategy #${strategyId} Info:`, `Pool: ${data.pool_address}`, `Current Tick: ${data.current_tick_float}`];

    if (data.ranges) {
        lines.push(`Ranges: ${JSON.stringify(data.ranges)}`);
    }

    return toResult(lines.join('\n'));
}
