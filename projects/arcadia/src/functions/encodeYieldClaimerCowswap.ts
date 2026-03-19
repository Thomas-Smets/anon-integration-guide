import { FunctionOptions, FunctionReturn, toResult } from '@heyanon/sdk';
import { resolveChain } from '../helpers/chains';
import { getAmAddress, STANDALONE_AM, type DexProtocol } from '../helpers/addresses';
import { COWSWAPPER_INITIATOR, encodeCowSwapTokenMetadata, encodeYieldClaimerCoupledCallbackData } from '../helpers/encoding';

interface Props {
    chainName: string;
    dexProtocol: DexProtocol;
    sellTokens: string[];
    buyToken: string;
    feeRecipient: string;
    enabled?: boolean;
}

export async function encodeYieldClaimerCowswap(
    { chainName, dexProtocol, sellTokens, buyToken, feeRecipient, enabled = true }: Props,
    _options: FunctionOptions,
): Promise<FunctionReturn> {
    const chainId = resolveChain(chainName);
    if (!chainId) {
        return toResult(`Unsupported chain: ${chainName}`, true);
    }

    const cowSwapperAddress = STANDALONE_AM.cowSwapper;
    const yieldClaimerAddress = getAmAddress('yieldClaimers', dexProtocol);

    if (!enabled) {
        return toResult(
            JSON.stringify({
                description: `Disable yield_claimer_cowswap (${dexProtocol})`,
                asset_managers: [cowSwapperAddress, yieldClaimerAddress],
                statuses: [false, false],
                datas: ['0x', '0x'],
            }),
        );
    }

    const cowSwapperData = encodeCowSwapTokenMetadata('cow_swap_yield_claim', sellTokens as `0x${string}`[], buyToken as `0x${string}`);

    const yieldClaimerData = encodeYieldClaimerCoupledCallbackData(COWSWAPPER_INITIATOR, feeRecipient as `0x${string}`, 'cow_swap_yield_claim');

    return toResult(
        JSON.stringify({
            description: `Enable yield_claimer_cowswap (${dexProtocol}, cowswap)`,
            asset_managers: [cowSwapperAddress, yieldClaimerAddress],
            statuses: [true, true],
            datas: [cowSwapperData, yieldClaimerData],
        }),
    );
}
