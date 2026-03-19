import { FunctionOptions, FunctionReturn, toResult } from '@heyanon/sdk';
import { resolveChain } from '../helpers/chains';
import { apiGet } from '../helpers/api';

interface Props {
    chainName: string;
    accountAddress: string;
}

export async function getAccountPnl({ chainName, accountAddress }: Props, _options: FunctionOptions): Promise<FunctionReturn> {
    const chainId = resolveChain(chainName);
    if (!chainId) {
        return toResult(`Unsupported chain: ${chainName}`, true);
    }

    if (!accountAddress) return toResult('accountAddress is required', true);

    const params = { chain_id: chainId, account_address: accountAddress };

    const [pnl, yieldData] = await Promise.all([apiGet<unknown>('/accounts/pnl_cost_basis', params), apiGet<unknown>('/accounts/yield_earned', params)]);

    const lines: string[] = [`Account: ${accountAddress}`];

    if (pnl) {
        lines.push(`PnL: ${JSON.stringify(pnl)}`);
    }

    if (yieldData) {
        lines.push(`Yield: ${JSON.stringify(yieldData)}`);
    }

    return toResult(lines.join('\n'));
}
