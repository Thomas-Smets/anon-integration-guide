import { FunctionOptions, FunctionReturn, toResult } from '@heyanon/sdk';
import { resolveChain } from '../helpers/chains';
import { STANDALONE_AM } from '../helpers/addresses';
import { MERKL_INITIATOR, encodeMerklOperatorCallbackData } from '../helpers/encoding';

interface Props {
    chainName: string;
    rewardRecipient: string;
    enabled?: boolean;
}

/**
 * Encodes configuration args for the Merkl operator automation.
 *
 * @param props - Function parameters
 * @param options - SDK function options (provider, signer, notifications)
 * @returns Result with encoded asset manager configuration
 */
export async function encodeMerklOperator({ chainName, rewardRecipient, enabled = true }: Props, _options: FunctionOptions): Promise<FunctionReturn> {
    const chainId = resolveChain(chainName);
    if (!chainId) {
        return toResult(`Unsupported chain: ${chainName}`, true);
    }

    const amAddress = STANDALONE_AM.merklOperator;

    if (!enabled) {
        return toResult(
            JSON.stringify({
                description: 'Disable merkl_operator',
                asset_managers: [amAddress],
                statuses: [false],
                datas: ['0x'],
            }),
        );
    }

    const callbackData = encodeMerklOperatorCallbackData(MERKL_INITIATOR, rewardRecipient as `0x${string}`);

    return toResult(
        JSON.stringify({
            description: 'Enable merkl_operator',
            asset_managers: [amAddress],
            statuses: [true],
            datas: [callbackData],
        }),
    );
}
