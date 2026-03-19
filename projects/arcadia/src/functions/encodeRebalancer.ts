import { FunctionOptions, FunctionReturn, toResult } from '@heyanon/sdk';
import { resolveChain } from '../helpers/chains';
import { getAmAddress, type DexProtocol } from '../helpers/addresses';
import { REBALANCER_INITIATOR, MINIMAL_STRATEGY_HOOK, encodeRebalancerMetadata, encodeRebalancerCallbackData } from '../helpers/encoding';

interface Props {
    chainName: string;
    dexProtocol: DexProtocol;
    enabled?: boolean;
}

export async function encodeRebalancer({ chainName, dexProtocol, enabled = true }: Props, _options: FunctionOptions): Promise<FunctionReturn> {
    const chainId = resolveChain(chainName);
    if (!chainId) {
        return toResult(`Unsupported chain: ${chainName}`, true);
    }

    const amAddress = getAmAddress('rebalancers', dexProtocol);

    if (!enabled) {
        return toResult(
            JSON.stringify({
                description: `Disable rebalancer (${dexProtocol})`,
                asset_managers: [amAddress],
                statuses: [false],
                datas: ['0x'],
            }),
        );
    }

    const metaData = encodeRebalancerMetadata({
        compoundLeftovers: 'all',
        optimalToken0Ratio: 500000,
        triggerLowerRatio: 0,
        triggerUpperRatio: 0,
        minRebalanceTime: 3600,
        maxRebalanceTime: 1e12,
    });

    const callbackData = encodeRebalancerCallbackData(REBALANCER_INITIATOR, MINIMAL_STRATEGY_HOOK, metaData);

    return toResult(
        JSON.stringify({
            description: `Enable rebalancer (default strategy, ${dexProtocol})`,
            asset_managers: [amAddress],
            statuses: [true],
            datas: [callbackData],
        }),
    );
}
