import { FunctionOptions, FunctionReturn, toResult } from '@heyanon/sdk';
import { resolveChain } from '../helpers/chains';
import { getAmAddress, STANDALONE_AM, type DexProtocol } from '../helpers/addresses';
import { COWSWAPPER_INITIATOR, encodeCowSwapTokenMetadata, encodeCompounderCoupledCallbackData } from '../helpers/encoding';

interface Props {
    chainName: string;
    dexProtocol: DexProtocol;
    sellTokens: string[];
    buyToken: string;
    enabled?: boolean;
}

/**
 * Encodes configuration args for compounder coupled with CowSwap for staked positions.
 *
 * @param props - Function parameters
 * @param options - SDK function options (provider, signer, notifications)
 * @returns Result with encoded asset manager configuration
 */
export async function encodeCompounderStaked({ chainName, dexProtocol, sellTokens, buyToken, enabled = true }: Props, _options: FunctionOptions): Promise<FunctionReturn> {
    const chainId = resolveChain(chainName);
    if (!chainId) {
        return toResult(`Unsupported chain: ${chainName}`, true);
    }

    const cowSwapperAddress = STANDALONE_AM.cowSwapper;
    const compounderAddress = getAmAddress('compounders', dexProtocol);

    if (!enabled) {
        return toResult(
            JSON.stringify({
                description: `Disable compounder_staked (${dexProtocol})`,
                asset_managers: [cowSwapperAddress, compounderAddress],
                statuses: [false, false],
                datas: ['0x', '0x'],
            }),
        );
    }

    const cowSwapperData = encodeCowSwapTokenMetadata('cow_swap_compound', sellTokens as `0x${string}`[], buyToken as `0x${string}`);

    const compounderData = encodeCompounderCoupledCallbackData(COWSWAPPER_INITIATOR, 'cow_swap_compound');

    return toResult(
        JSON.stringify({
            description: `Enable compounder_staked (${dexProtocol}, cowswap)`,
            asset_managers: [cowSwapperAddress, compounderAddress],
            statuses: [true, true],
            datas: [cowSwapperData, compounderData],
        }),
    );
}
