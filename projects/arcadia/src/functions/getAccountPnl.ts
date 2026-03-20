import { FunctionOptions, FunctionReturn, toResult } from '@heyanon/sdk';
import { resolveChain } from '../helpers/chains';
import { apiGet } from '../helpers/api';

interface Props {
    chainName: string;
    accountAddress: string;
}

/**
 * Retrieves PnL and yield data for an Arcadia account.
 *
 * @param props - Function parameters
 * @param options - SDK function options (provider, signer, notifications)
 * @returns Result with formatted PnL and yield data
 */
export async function getAccountPnl({ chainName, accountAddress }: Props, _options: FunctionOptions): Promise<FunctionReturn> {
    const chainId = resolveChain(chainName);
    if (!chainId) {
        return toResult(`Unsupported chain: ${chainName}`, true);
    }

    if (!accountAddress) return toResult('accountAddress is required', true);

    const params = { chain_id: chainId, account_address: accountAddress };

    const [pnl, yieldData] = await Promise.all([apiGet<unknown>('/accounts/pnl_cost_basis', params), apiGet<unknown>('/accounts/yield_earned', params)]);

    const lines: string[] = [`Account: ${accountAddress}`];

    if (pnl && typeof pnl === 'object') {
        const p = pnl as Record<string, unknown>;
        lines.push(`PnL: total=${p.total_pnl ?? 'N/A'}, realized=${p.realized_pnl ?? 'N/A'}, unrealized=${p.unrealized_pnl ?? 'N/A'}`);
    }

    if (yieldData && typeof yieldData === 'object') {
        const y = yieldData as Record<string, unknown>;
        lines.push(`Yield earned: ${y.total_yield_usd ?? JSON.stringify(yieldData).slice(0, 200)}`);
    }

    return toResult(lines.join('\n'));
}
