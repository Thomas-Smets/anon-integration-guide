import { FunctionOptions, FunctionReturn, toResult } from '@heyanon/sdk';
import { resolveChain } from '../helpers/chains';

import { apiGet } from '../helpers/api';

interface Props {
    chainName: string;
    accountAddress: string;
}

interface AccountOverview {
    owner: string;
    creditor: string;
    health_factor: number;
    collateral_value: string;
    debt_value: string;
    assets: Array<{ address: string; symbol: string; amount: string }>;
}

/**
 * Retrieves detailed info for an Arcadia account including health factor, collateral, debt, and positions.
 *
 * @param props - Function parameters
 * @param options - SDK function options (provider, signer, notifications)
 * @returns Result with formatted account data
 */
export async function getAccountInfo({ chainName, accountAddress }: Props, _options: FunctionOptions): Promise<FunctionReturn> {
    const chainId = resolveChain(chainName);
    if (!chainId) {
        return toResult(`Unsupported chain: ${chainName}`, true);
    }

    if (!accountAddress) return toResult('accountAddress is required', true);

    const data = await apiGet<AccountOverview>('/accounts/overview', {
        chain_id: chainId,
        account: accountAddress,
    });

    const hf = data.health_factor != null ? (data.health_factor * 100).toFixed(1) + '%' : 'N/A';
    const isSpot = !data.creditor || data.creditor === '0x0000000000000000000000000000000000000000';
    const accountType = isSpot ? 'Spot' : 'Margin';

    const assetLines = data.assets && data.assets.length > 0 ? data.assets.map((a) => `  - ${a.symbol || a.address}: ${a.amount}`).join('\n') : '  (none)';

    return toResult(
        `Account: ${accountAddress}\n` +
            `Type: ${accountType}\n` +
            `Health Factor: ${hf}\n` +
            `Collateral: ${data.collateral_value || '0'}\n` +
            `Debt: ${data.debt_value || '0'}\n` +
            `Assets:\n${assetLines}`,
    );
}
