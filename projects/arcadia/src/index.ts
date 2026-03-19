import { AdapterExport, AdapterTag, Chain, EVM } from '@heyanon/sdk';
import { SUPPORTED_CHAINS } from './constants';
import * as functions from './functions';
import { tools } from './tools';

const { getChainName } = EVM.utils;

export default {
    tools,
    functions,
    description:
        'Arcadia Finance: deploy and manage concentrated liquidity positions on Uniswap and Aerodrome with automated rebalancing, compounding, and yield optimization on Base.',
    tags: [AdapterTag.LP, AdapterTag.LENDING],
    chains: SUPPORTED_CHAINS.map(getChainName) as Chain[],
    executableFunctions: [
        'createAccount',
        'deposit',
        'withdraw',
        'borrow',
        'repay',
        'approve',
        'addLiquidity',
        'close',
        'swap',
        'deleverage',
        'removeLiquidity',
        'stake',
        'setAssetManagers',
    ],
} satisfies AdapterExport;
