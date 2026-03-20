import { FunctionOptions, FunctionReturn, toResult } from '@heyanon/sdk';
import { resolveChain } from '../helpers/chains';
import { apiGet } from '../helpers/api';

interface Props {
    chainName: string;
}

interface Asset {
    name: string;
    address: string;
    decimals: number;
    standard: string;
}

interface AssetResponse {
    assets: Asset[];
}

/**
 * Lists all supported assets on Arcadia.
 *
 * @param props - Function parameters
 * @param options - SDK function options (provider, signer, notifications)
 * @returns Result with formatted asset list data
 */
export async function getAssetList({ chainName }: Props, _options: FunctionOptions): Promise<FunctionReturn> {
    const chainId = resolveChain(chainName);
    if (!chainId) {
        return toResult(`Unsupported chain: ${chainName}`, true);
    }

    const data = await apiGet<AssetResponse>('/assets', { chain_id: chainId });
    const assets = data.assets;

    if (!assets || assets.length === 0) {
        return toResult(`No supported assets found on ${chainName}.`);
    }

    const lines = assets.slice(0, 20).map((a) => `  ${a.name} (${a.address}, ${a.decimals} decimals)`);
    const suffix = assets.length > 20 ? `\n  ... and ${assets.length - 20} more` : '';

    return toResult(`Supported assets on ${chainName} (${assets.length} total):\n${lines.join('\n')}${suffix}`);
}
