import { FunctionOptions, FunctionReturn, toResult } from '@heyanon/sdk';
import { resolveChain } from '../helpers/chains';

interface Props {
    chainName: string;
}

const AUTOMATIONS = [
    { name: 'rebalancer', description: 'Automatically rebalances LP positions when they go out of range.' },
    { name: 'compounder', description: 'Compounds earned fees back into the LP position.' },
    { name: 'compounder_staked', description: 'Compounds fees for staked LP positions using CowSwap.' },
    { name: 'yield_claimer', description: 'Claims accrued yield and sends it to a fee recipient.' },
    { name: 'yield_claimer_cowswap', description: 'Claims yield and swaps it to a target token via CowSwap.' },
    { name: 'cow_swapper', description: 'Standalone CowSwap integration for gasless token swaps.' },
    { name: 'merkl_operator', description: 'Claims Merkl rewards and sends them to a reward recipient.' },
];

/**
 * Lists available asset manager automations.
 *
 * @param props - Function parameters
 * @param options - SDK function options (provider, signer, notifications)
 * @returns Result with formatted automation list
 */
export async function getAssetManagerIntents({ chainName }: Props, _options: FunctionOptions): Promise<FunctionReturn> {
    const chainId = resolveChain(chainName);
    if (!chainId) {
        return toResult(`Unsupported chain: ${chainName}`, true);
    }

    const lines = AUTOMATIONS.map((a) => `- ${a.name}: ${a.description}`);
    return toResult(`Available Arcadia Automations on ${chainName}:\n${lines.join('\n')}`);
}
