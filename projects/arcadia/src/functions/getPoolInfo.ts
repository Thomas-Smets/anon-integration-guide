import { FunctionOptions, FunctionReturn, toResult } from '@heyanon/sdk';
import { resolveChain } from '../helpers/chains';
import { apiGet } from '../helpers/api';

interface Props {
    chainName: string;
    poolAddress: string;
}

/**
 * Retrieves detailed info for a specific Arcadia lending pool.
 *
 * @param props - Function parameters
 * @param options - SDK function options (provider, signer, notifications)
 * @returns Result with formatted pool data
 */
export async function getPoolInfo({ chainName, poolAddress }: Props, _options: FunctionOptions): Promise<FunctionReturn> {
    const chainId = resolveChain(chainName);
    if (!chainId) {
        return toResult(`Unsupported chain: ${chainName}`, true);
    }

    if (!poolAddress) return toResult('poolAddress is required', true);

    const data = await apiGet<Record<string, unknown>>('/pools_data', {
        chain_id: chainId,
        pool_address: poolAddress,
    });

    const lines = [
        `Pool: ${poolAddress}`,
        `Name: ${data.name ?? 'N/A'}`,
        `APY: ${data.apy != null ? (Number(data.apy) * 100).toFixed(2) + '%' : 'N/A'}`,
        `Utilisation: ${data.utilisation != null ? (Number(data.utilisation) * 100).toFixed(1) + '%' : 'N/A'}`,
        `TVL: ${data.total_realised_liquidity_usd != null ? '$' + (Number(data.total_realised_liquidity_usd) / 1e6).toFixed(2) + 'M' : 'N/A'}`,
        `Total Borrow: ${data.total_open_borrow_usd != null ? '$' + (Number(data.total_open_borrow_usd) / 1e6).toFixed(2) + 'M' : 'N/A'}`,
    ];

    return toResult(lines.join('\n'));
}
