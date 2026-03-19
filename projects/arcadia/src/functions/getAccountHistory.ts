import { FunctionOptions, FunctionReturn, toResult } from '@heyanon/sdk';
import { resolveChain } from '../helpers/chains';
import { apiGet } from '../helpers/api';

interface Props {
    chainName: string;
    accountAddress: string;
    days?: number;
}

interface HistoricResponse {
    values: Record<string, number>;
    value_now: { timestamp: number; usd_value: number };
}

export async function getAccountHistory({ chainName, accountAddress, days }: Props, _options: FunctionOptions): Promise<FunctionReturn> {
    const chainId = resolveChain(chainName);
    if (!chainId) {
        return toResult(`Unsupported chain: ${chainName}`, true);
    }

    if (!accountAddress) return toResult('accountAddress is required', true);

    const numDays = days ?? 14;
    const end = Math.floor(Date.now() / 1000);
    const start = end - numDays * 86400;

    const data = await apiGet<HistoricResponse>('/accounts/historic_account_values', {
        chain_id: chainId,
        account_address: accountAddress,
        start,
        end,
    });

    const entries = Object.entries(data.values ?? {}).sort(([a], [b]) => Number(a) - Number(b));

    if (entries.length === 0) {
        return toResult(`No history found for account ${accountAddress} over the last ${numDays} days.`);
    }

    const lines = entries.slice(-10).map(([ts, val]) => {
        const date = new Date(Number(ts) * 1000).toISOString().slice(0, 10);
        return `  ${date}: $${Number(val).toFixed(2)}`;
    });

    if (data.value_now) {
        lines.push(`  Now: $${Number(data.value_now.usd_value).toFixed(2)}`);
    }

    return toResult(`Account ${accountAddress} value history (last ${numDays} days, showing up to 10 points):\n${lines.join('\n')}`);
}
