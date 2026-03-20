import { FunctionOptions, FunctionReturn, toResult } from '@heyanon/sdk';
import { resolveChain } from '../helpers/chains';

interface Props {
    chainName: string;
    topic: string;
}

const GUIDES: Record<string, string> = {
    overview: [
        'Arcadia Finance lets you deploy and manage concentrated liquidity positions with optional leverage.',
        'Core workflow: create an account, deposit collateral, open an LP position via a strategy, and optionally borrow to leverage.',
        'Accounts hold your assets on-chain. Margin accounts connect to a lending pool for borrowing. Spot accounts have no debt.',
        'Use getWalletAccounts to list accounts, getAccountInfo for details, and getStrategyList to find strategies.',
    ].join(' '),
    strategies: [
        'Strategies define concentrated liquidity positions on Uniswap V3 or Aerodrome (Slipstream).',
        'Each strategy has a pair (e.g. WETH/USDC), a DEX protocol, a fee tier, and a tick range.',
        'Use getStrategyList to browse available strategies. Use getStrategyInfo with a strategyId for full details.',
        'To open a position: call addLiquidity with your account, strategy ID, deposit token, amount, and leverage.',
        'Leverage 0 means no borrowing. Leverage 2 means 2x exposure funded by the lending pool.',
    ].join(' '),
    automations: [
        'Arcadia offers on-chain automations (asset managers) that run without manual intervention.',
        'Rebalancer: re-centers your LP when it drifts out of range.',
        'Compounder: reinvests earned fees back into the LP position.',
        'Yield Claimer: claims accrued fees and sends them to a wallet.',
        'CowSwap variants: use CowSwap for gas-efficient token swaps during compounding or yield claiming.',
        'Merkl Operator: claims Merkl reward distributions.',
        'Enable automations via setAssetManagers. Encode parameters with the encode* tools first.',
    ].join(' '),
};

/**
 * Retrieves a workflow guide on an Arcadia topic.
 *
 * @param props - Function parameters
 * @param options - SDK function options (provider, signer, notifications)
 * @returns Result with formatted guide content
 */
export async function getGuides({ chainName, topic }: Props, _options: FunctionOptions): Promise<FunctionReturn> {
    const chainId = resolveChain(chainName);
    if (!chainId) {
        return toResult(`Unsupported chain: ${chainName}`, true);
    }

    const key = topic.toLowerCase();
    const guide = GUIDES[key];

    if (!guide) {
        const available = Object.keys(GUIDES).join(', ');
        return toResult(`Unknown topic "${topic}". Available topics: ${available}`, true);
    }

    return toResult(`Guide: ${topic}\n\n${guide}`);
}
