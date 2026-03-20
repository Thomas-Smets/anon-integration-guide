import { FunctionOptions, FunctionReturn, toResult } from '@heyanon/sdk';

/**
 * Returns a plain-language description of the Arcadia Finance protocol.
 *
 * @param _props - Function parameters (unused)
 * @param _options - SDK function options (unused)
 * @returns Result with protocol overview
 */
export async function getProtocolDescription(_props: Record<string, never>, _options: FunctionOptions): Promise<FunctionReturn> {
    return toResult(
        `Arcadia Finance lets you manage concentrated liquidity positions on decentralized exchanges (Uniswap and Aerodrome) on the Base network.\n\n` +
            `Core concepts:\n` +
            `- Account: A smart contract wallet that holds your assets. Can be "spot" (no borrowing) or "margin" (with borrowing).\n` +
            `- LP Position: You provide tokens to a trading pair and earn fees from trades. Arcadia handles the complexity of setting price ranges.\n` +
            `- Leverage: Margin accounts can borrow from lending pools to amplify your LP position size.\n` +
            `- Health Factor: A safety score from 0% to 100%. Higher is safer. At 0% your position can be liquidated.\n\n` +
            `Typical workflow:\n` +
            `1. Create an account (spot or margin)\n` +
            `2. Approve and deposit tokens\n` +
            `3. Open an LP position on a strategy\n` +
            `4. Optionally enable automations (rebalancer, compounder, yield claimer)\n` +
            `5. Monitor health factor and PnL\n` +
            `6. Close position or withdraw when ready\n\n` +
            `Automations run in the background to keep your position optimized without manual intervention.`,
    );
}
