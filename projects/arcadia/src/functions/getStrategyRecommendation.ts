import { FunctionOptions, FunctionReturn, toResult } from '@heyanon/sdk';
import { resolveChain } from '../helpers/chains';
import { apiGet } from '../helpers/api';

interface Props {
    chainName: string;
    accountAddress: string;
}

/**
 * Retrieves a rebalancing recommendation for an Arcadia account.
 *
 * @param props - Function parameters
 * @param options - SDK function options (provider, signer, notifications)
 * @returns Result with formatted recommendation data
 */
export async function getStrategyRecommendation({ chainName, accountAddress }: Props, _options: FunctionOptions): Promise<FunctionReturn> {
    const chainId = resolveChain(chainName);
    if (!chainId) {
        return toResult(`Unsupported chain: ${chainName}`, true);
    }

    if (!accountAddress) return toResult('accountAddress is required', true);

    const data = await apiGet<Record<string, unknown>>('/recommendation', {
        chain_id: chainId,
        account: accountAddress,
    });

    const lines = [`Recommendation for ${accountAddress}:`];

    if (data.action) lines.push(`Action: ${data.action}`);
    if (data.strategy_id != null) lines.push(`Strategy: #${data.strategy_id}`);
    if (data.reason) lines.push(`Reason: ${String(data.reason).slice(0, 300)}`);

    const serialized = JSON.stringify(data);
    if (lines.length === 1) {
        lines.push(serialized.slice(0, 1000));
    }

    return toResult(lines.join('\n'));
}
