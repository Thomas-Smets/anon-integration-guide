import { FunctionOptions, FunctionReturn, toResult } from '@heyanon/sdk';
import { resolveChain } from '../helpers/chains';
import { getAmAddress, type DexProtocol } from '../helpers/addresses';
import { CLAIMER_INITIATOR, encodeYieldClaimerCallbackData } from '../helpers/encoding';

interface Props {
    chainName: string;
    dexProtocol: DexProtocol;
    feeRecipient: string;
    enabled?: boolean;
}

/**
 * Encodes configuration args for the standalone yield claimer automation.
 *
 * @param props - Function parameters
 * @param options - SDK function options (provider, signer, notifications)
 * @returns Result with encoded asset manager configuration
 */
export async function encodeYieldClaimer({ chainName, dexProtocol, feeRecipient, enabled = true }: Props, _options: FunctionOptions): Promise<FunctionReturn> {
    const chainId = resolveChain(chainName);
    if (!chainId) {
        return toResult(`Unsupported chain: ${chainName}`, true);
    }

    const amAddress = getAmAddress('yieldClaimers', dexProtocol);

    if (!enabled) {
        return toResult(
            JSON.stringify({
                description: `Disable yield_claimer (${dexProtocol})`,
                asset_managers: [amAddress],
                statuses: [false],
                datas: ['0x'],
            }),
        );
    }

    const callbackData = encodeYieldClaimerCallbackData(CLAIMER_INITIATOR, feeRecipient as `0x${string}`);

    return toResult(
        JSON.stringify({
            description: `Enable yield_claimer (${dexProtocol})`,
            asset_managers: [amAddress],
            statuses: [true],
            datas: [callbackData],
        }),
    );
}
