import { FunctionOptions, FunctionReturn, toResult } from '@heyanon/sdk';
import { resolveChain } from '../helpers/chains';
import { STANDALONE_AM } from '../helpers/addresses';
import { encodeOuterMetadata } from '../helpers/encoding';

interface Props {
    chainName: string;
    enabled?: boolean;
}

/**
 * Encodes configuration args for standalone direct CowSwap mode.
 *
 * @param props - Function parameters
 * @param options - SDK function options (provider, signer, notifications)
 * @returns Result with encoded asset manager configuration
 */
export async function encodeCowSwapper({ chainName, enabled = true }: Props, _options: FunctionOptions): Promise<FunctionReturn> {
    const chainId = resolveChain(chainName);
    if (!chainId) {
        return toResult(`Unsupported chain: ${chainName}`, true);
    }

    const cowSwapperAddress = STANDALONE_AM.cowSwapper;

    if (!enabled) {
        return toResult(
            JSON.stringify({
                description: 'Disable cow_swapper',
                asset_managers: [cowSwapperAddress],
                statuses: [false],
                datas: ['0x'],
            }),
        );
    }

    const cowSwapperData = encodeOuterMetadata('cow_swap_direct', '0x');

    return toResult(
        JSON.stringify({
            description: 'Enable cow_swapper (direct mode)',
            asset_managers: [cowSwapperAddress],
            statuses: [true],
            datas: [cowSwapperData],
        }),
    );
}
