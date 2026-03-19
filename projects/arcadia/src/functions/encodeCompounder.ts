import { FunctionOptions, FunctionReturn, toResult } from '@heyanon/sdk';
import { resolveChain } from '../helpers/chains';
import { getAmAddress, type DexProtocol } from '../helpers/addresses';
import { COMPOUNDER_INITIATOR, encodeCompounderCallbackData } from '../helpers/encoding';

interface Props {
    chainName: string;
    dexProtocol: DexProtocol;
    enabled?: boolean;
}

export async function encodeCompounder({ chainName, dexProtocol, enabled = true }: Props, _options: FunctionOptions): Promise<FunctionReturn> {
    const chainId = resolveChain(chainName);
    if (!chainId) {
        return toResult(`Unsupported chain: ${chainName}`, true);
    }

    const amAddress = getAmAddress('compounders', dexProtocol);

    if (!enabled) {
        return toResult(
            JSON.stringify({
                description: `Disable compounder (${dexProtocol})`,
                asset_managers: [amAddress],
                statuses: [false],
                datas: ['0x'],
            }),
        );
    }

    const callbackData = encodeCompounderCallbackData(COMPOUNDER_INITIATOR);

    return toResult(
        JSON.stringify({
            description: `Enable compounder (${dexProtocol})`,
            asset_managers: [amAddress],
            statuses: [true],
            datas: [callbackData],
        }),
    );
}
