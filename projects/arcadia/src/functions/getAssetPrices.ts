import { FunctionOptions, FunctionReturn, toResult } from '@heyanon/sdk';
import { resolveChain } from '../helpers/chains';
import { apiGet } from '../helpers/api';

interface Props {
    chainName: string;
    assets: string[];
}

export async function getAssetPrices({ chainName, assets }: Props, _options: FunctionOptions): Promise<FunctionReturn> {
    const chainId = resolveChain(chainName);
    if (!chainId) {
        return toResult(`Unsupported chain: ${chainName}`, true);
    }

    if (!assets || assets.length === 0) return toResult('At least one asset address is required', true);

    const queryParts = assets.map((a) => `assets=${encodeURIComponent(a)}`).join('&');
    const data = await apiGet<Record<string, number>>(`/assets/prices?chain_id=${chainId}&${queryParts}`);

    const entries = Object.entries(data);
    if (entries.length === 0) {
        return toResult('No price data found for the requested assets.');
    }

    const lines = entries.map(([address, price]) => `  ${address}: $${price}`);
    return toResult(`Asset prices on ${chainName}:\n${lines.join('\n')}`);
}
