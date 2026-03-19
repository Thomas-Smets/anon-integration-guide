import { AdapterExport, EVM } from '@heyanon/sdk';
import { SUPPORTED_CHAINS } from './constants';

const { getChainName } = EVM.utils;

const chainEnum = SUPPORTED_CHAINS.map((id) => getChainName(id));

export const tools = [
    // ── Getters ──────────────────────────────────────────────────────
    {
        type: 'function',
        function: {
            name: 'getWalletAccounts',
            description: 'List all Arcadia accounts owned by a wallet address on Base.',
            strict: true,
            parameters: {
                type: 'object',
                properties: {
                    chainName: { type: 'string', enum: chainEnum, description: 'Chain name' },
                },
                required: ['chainName'],
                additionalProperties: false,
            },
        },
    },
    {
        type: 'function',
        function: {
            name: 'getAccountInfo',
            description: 'Get detailed info for an Arcadia account: health factor, collateral, debt, and positions.',
            strict: true,
            parameters: {
                type: 'object',
                properties: {
                    chainName: { type: 'string', enum: chainEnum, description: 'Chain name' },
                    accountAddress: { type: 'string', description: 'Arcadia account address' },
                },
                required: ['chainName', 'accountAddress'],
                additionalProperties: false,
            },
        },
    },
    {
        type: 'function',
        function: {
            name: 'getPoolList',
            description: 'List Arcadia lending pools with APY, utilization, and TVL on Base.',
            strict: true,
            parameters: {
                type: 'object',
                properties: {
                    chainName: { type: 'string', enum: chainEnum, description: 'Chain name' },
                },
                required: ['chainName'],
                additionalProperties: false,
            },
        },
    },
    {
        type: 'function',
        function: {
            name: 'getStrategyList',
            description: 'List featured LP strategies on Arcadia with APY and pool details.',
            strict: true,
            parameters: {
                type: 'object',
                properties: {
                    chainName: { type: 'string', enum: chainEnum, description: 'Chain name' },
                },
                required: ['chainName'],
                additionalProperties: false,
            },
        },
    },
    {
        type: 'function',
        function: {
            name: 'getAccountHistory',
            description: 'Get account value history over time for an Arcadia account.',
            strict: true,
            parameters: {
                type: 'object',
                properties: {
                    chainName: { type: 'string', enum: chainEnum, description: 'Chain name' },
                    accountAddress: { type: 'string', description: 'Arcadia account address' },
                    days: { type: 'number', description: 'Number of days of history. Default is 14.' },
                },
                required: ['chainName', 'accountAddress'],
                additionalProperties: false,
            },
        },
    },
    {
        type: 'function',
        function: {
            name: 'getAccountPnl',
            description: 'Get PnL and yield earned for an Arcadia account.',
            strict: true,
            parameters: {
                type: 'object',
                properties: {
                    chainName: { type: 'string', enum: chainEnum, description: 'Chain name' },
                    accountAddress: { type: 'string', description: 'Arcadia account address' },
                },
                required: ['chainName', 'accountAddress'],
                additionalProperties: false,
            },
        },
    },
    {
        type: 'function',
        function: {
            name: 'getWalletBalances',
            description: 'Get token balances for the connected wallet on supported Arcadia tokens.',
            strict: true,
            parameters: {
                type: 'object',
                properties: {
                    chainName: { type: 'string', enum: chainEnum, description: 'Chain name' },
                },
                required: ['chainName'],
                additionalProperties: false,
            },
        },
    },
    {
        type: 'function',
        function: {
            name: 'getWalletAllowances',
            description: 'Get token allowances for a spender address on supported Arcadia tokens.',
            strict: true,
            parameters: {
                type: 'object',
                properties: {
                    chainName: { type: 'string', enum: chainEnum, description: 'Chain name' },
                    spender: { type: 'string', description: 'Address to check allowances for (e.g. Arcadia account or pool)' },
                },
                required: ['chainName', 'spender'],
                additionalProperties: false,
            },
        },
    },
    {
        type: 'function',
        function: {
            name: 'getWalletPoints',
            description: 'Get Arcadia points earned by the connected wallet.',
            strict: true,
            parameters: {
                type: 'object',
                properties: {
                    chainName: { type: 'string', enum: chainEnum, description: 'Chain name' },
                },
                required: ['chainName'],
                additionalProperties: false,
            },
        },
    },
    {
        type: 'function',
        function: {
            name: 'getStrategyInfo',
            description: 'Get detailed info for a specific Arcadia LP strategy by ID.',
            strict: true,
            parameters: {
                type: 'object',
                properties: {
                    chainName: { type: 'string', enum: chainEnum, description: 'Chain name' },
                    strategyId: { type: 'number', description: 'Strategy ID from getStrategyList' },
                },
                required: ['chainName', 'strategyId'],
                additionalProperties: false,
            },
        },
    },
    {
        type: 'function',
        function: {
            name: 'getStrategyRecommendation',
            description: 'Get a strategy recommendation for an Arcadia account based on its current state.',
            strict: true,
            parameters: {
                type: 'object',
                properties: {
                    chainName: { type: 'string', enum: chainEnum, description: 'Chain name' },
                    accountAddress: { type: 'string', description: 'Arcadia account address' },
                },
                required: ['chainName', 'accountAddress'],
                additionalProperties: false,
            },
        },
    },
    {
        type: 'function',
        function: {
            name: 'getAssetManagerIntents',
            description: 'List available Arcadia asset manager automations (rebalancer, compounder, yield claimer, etc.).',
            strict: true,
            parameters: {
                type: 'object',
                properties: {
                    chainName: { type: 'string', enum: chainEnum, description: 'Chain name' },
                },
                required: ['chainName'],
                additionalProperties: false,
            },
        },
    },
    {
        type: 'function',
        function: {
            name: 'getAssetList',
            description: 'List all supported assets on Arcadia with address and decimals.',
            strict: true,
            parameters: {
                type: 'object',
                properties: {
                    chainName: { type: 'string', enum: chainEnum, description: 'Chain name' },
                },
                required: ['chainName'],
                additionalProperties: false,
            },
        },
    },
    {
        type: 'function',
        function: {
            name: 'getAssetPrices',
            description: 'Get current prices for specific assets by address.',
            strict: true,
            parameters: {
                type: 'object',
                properties: {
                    chainName: { type: 'string', enum: chainEnum, description: 'Chain name' },
                    assets: {
                        type: 'array',
                        items: { type: 'string' },
                        description: 'Array of asset contract addresses to get prices for',
                    },
                },
                required: ['chainName', 'assets'],
                additionalProperties: false,
            },
        },
    },
    {
        type: 'function',
        function: {
            name: 'getPoolInfo',
            description: 'Get detailed info for a specific Arcadia lending pool by address.',
            strict: true,
            parameters: {
                type: 'object',
                properties: {
                    chainName: { type: 'string', enum: chainEnum, description: 'Chain name' },
                    poolAddress: { type: 'string', description: 'Lending pool contract address' },
                },
                required: ['chainName', 'poolAddress'],
                additionalProperties: false,
            },
        },
    },
    {
        type: 'function',
        function: {
            name: 'getPointLeaderboard',
            description: 'Get the Arcadia points leaderboard showing top wallets.',
            strict: true,
            parameters: {
                type: 'object',
                properties: {
                    chainName: { type: 'string', enum: chainEnum, description: 'Chain name' },
                },
                required: ['chainName'],
                additionalProperties: false,
            },
        },
    },
    {
        type: 'function',
        function: {
            name: 'getGuides',
            description: 'Get a workflow guide on an Arcadia topic. Topics: overview, strategies, automations.',
            strict: true,
            parameters: {
                type: 'object',
                properties: {
                    chainName: { type: 'string', enum: chainEnum, description: 'Chain name' },
                    topic: { type: 'string', description: 'Guide topic: overview, strategies, or automations' },
                },
                required: ['chainName', 'topic'],
                additionalProperties: false,
            },
        },
    },
    // ── Direct contract actions ──────────────────────────────────────
    {
        type: 'function',
        function: {
            name: 'createAccount',
            description: 'Create a new Arcadia account (margin or spot) via the Factory contract.',
            strict: true,
            parameters: {
                type: 'object',
                properties: {
                    chainName: { type: 'string', enum: chainEnum, description: 'Chain name' },
                    creditor: {
                        type: 'string',
                        description: 'Lending pool address for margin accounts. Use 0x0000000000000000000000000000000000000000 for spot.',
                    },
                },
                required: ['chainName', 'creditor'],
                additionalProperties: false,
            },
        },
    },
    {
        type: 'function',
        function: {
            name: 'deposit',
            description: 'Deposit ERC20 tokens from wallet into an Arcadia account.',
            strict: true,
            parameters: {
                type: 'object',
                properties: {
                    chainName: { type: 'string', enum: chainEnum, description: 'Chain name' },
                    accountAddress: { type: 'string', description: 'Arcadia account address' },
                    tokenAddress: { type: 'string', description: 'ERC20 token to deposit' },
                    amount: { type: 'string', description: 'Amount in decimal format (e.g. "100.5")' },
                },
                required: ['chainName', 'accountAddress', 'tokenAddress', 'amount'],
                additionalProperties: false,
            },
        },
    },
    {
        type: 'function',
        function: {
            name: 'withdraw',
            description: 'Withdraw ERC20 tokens from an Arcadia account to the wallet.',
            strict: true,
            parameters: {
                type: 'object',
                properties: {
                    chainName: { type: 'string', enum: chainEnum, description: 'Chain name' },
                    accountAddress: { type: 'string', description: 'Arcadia account address' },
                    tokenAddress: { type: 'string', description: 'ERC20 token to withdraw' },
                    amount: { type: 'string', description: 'Amount in decimal format (e.g. "100.5")' },
                },
                required: ['chainName', 'accountAddress', 'tokenAddress', 'amount'],
                additionalProperties: false,
            },
        },
    },
    {
        type: 'function',
        function: {
            name: 'borrow',
            description: 'Borrow tokens from an Arcadia lending pool against account collateral.',
            strict: true,
            parameters: {
                type: 'object',
                properties: {
                    chainName: { type: 'string', enum: chainEnum, description: 'Chain name' },
                    accountAddress: { type: 'string', description: 'Arcadia account address' },
                    poolAddress: { type: 'string', description: 'Lending pool to borrow from' },
                    amount: { type: 'string', description: 'Amount in decimal format (e.g. "1000")' },
                },
                required: ['chainName', 'accountAddress', 'poolAddress', 'amount'],
                additionalProperties: false,
            },
        },
    },
    {
        type: 'function',
        function: {
            name: 'repay',
            description: 'Repay debt to an Arcadia lending pool from wallet tokens.',
            strict: true,
            parameters: {
                type: 'object',
                properties: {
                    chainName: { type: 'string', enum: chainEnum, description: 'Chain name' },
                    accountAddress: { type: 'string', description: 'Arcadia account address' },
                    poolAddress: { type: 'string', description: 'Lending pool to repay' },
                    amount: { type: 'string', description: 'Amount in decimal format (e.g. "1000")' },
                },
                required: ['chainName', 'accountAddress', 'poolAddress', 'amount'],
                additionalProperties: false,
            },
        },
    },
    {
        type: 'function',
        function: {
            name: 'approve',
            description: 'Approve an ERC20 token for spending by an Arcadia account or lending pool.',
            strict: true,
            parameters: {
                type: 'object',
                properties: {
                    chainName: { type: 'string', enum: chainEnum, description: 'Chain name' },
                    tokenAddress: { type: 'string', description: 'ERC20 token to approve' },
                    spender: { type: 'string', description: 'Address to approve (account or pool)' },
                    amount: { type: 'string', description: 'Amount in decimal format. Use "max" for unlimited.' },
                },
                required: ['chainName', 'tokenAddress', 'spender', 'amount'],
                additionalProperties: false,
            },
        },
    },
    // ── API-routed actions ───────────────────────────────────────────
    {
        type: 'function',
        function: {
            name: 'addLiquidity',
            description:
                'Open an LP position on Arcadia. Atomically deposits from wallet, swaps to optimal ratio, and mints the LP. Supports optional leverage for margin accounts.',
            strict: true,
            parameters: {
                type: 'object',
                properties: {
                    chainName: { type: 'string', enum: chainEnum, description: 'Chain name' },
                    accountAddress: { type: 'string', description: 'Arcadia account address' },
                    strategyId: { type: 'number', description: 'Strategy ID from getStrategyList' },
                    tokenAddress: { type: 'string', description: 'Token to deposit from wallet' },
                    amount: { type: 'string', description: 'Amount in decimal format' },
                    leverage: { type: 'number', description: '0 = no borrow, 2 = 2x leverage. Default 0.' },
                },
                required: ['chainName', 'accountAddress', 'strategyId', 'tokenAddress', 'amount', 'leverage'],
                additionalProperties: false,
            },
        },
    },
    {
        type: 'function',
        function: {
            name: 'close',
            description: 'Close an Arcadia account position. Burns LP, swaps to target token, and repays debt atomically.',
            strict: true,
            parameters: {
                type: 'object',
                properties: {
                    chainName: { type: 'string', enum: chainEnum, description: 'Chain name' },
                    accountAddress: { type: 'string', description: 'Arcadia account address' },
                    receiveTokenAddress: { type: 'string', description: 'Target token to receive after closing' },
                },
                required: ['chainName', 'accountAddress', 'receiveTokenAddress'],
                additionalProperties: false,
            },
        },
    },
    {
        type: 'function',
        function: {
            name: 'swap',
            description: 'Swap tokens within an Arcadia account. The backend finds the optimal route.',
            strict: true,
            parameters: {
                type: 'object',
                properties: {
                    chainName: { type: 'string', enum: chainEnum, description: 'Chain name' },
                    accountAddress: { type: 'string', description: 'Arcadia account address' },
                    tokenFrom: { type: 'string', description: 'Token address to swap from' },
                    tokenTo: { type: 'string', description: 'Token address to swap to' },
                    amount: { type: 'string', description: 'Amount in decimal format' },
                },
                required: ['chainName', 'accountAddress', 'tokenFrom', 'tokenTo', 'amount'],
                additionalProperties: false,
            },
        },
    },
    {
        type: 'function',
        function: {
            name: 'deleverage',
            description: 'Sell account collateral to repay debt without needing wallet tokens.',
            strict: true,
            parameters: {
                type: 'object',
                properties: {
                    chainName: { type: 'string', enum: chainEnum, description: 'Chain name' },
                    accountAddress: { type: 'string', description: 'Arcadia account address' },
                    tokenFrom: { type: 'string', description: 'Collateral token to sell' },
                    amount: { type: 'string', description: 'Collateral amount in decimal format' },
                },
                required: ['chainName', 'accountAddress', 'tokenFrom', 'amount'],
                additionalProperties: false,
            },
        },
    },
    {
        type: 'function',
        function: {
            name: 'removeLiquidity',
            description: 'Partially decrease liquidity from an LP position. The position stays open with reduced liquidity.',
            strict: true,
            parameters: {
                type: 'object',
                properties: {
                    chainName: { type: 'string', enum: chainEnum, description: 'Chain name' },
                    accountAddress: { type: 'string', description: 'Arcadia account address' },
                    assetAddress: { type: 'string', description: 'Position manager contract address' },
                    assetId: { type: 'number', description: 'NFT token ID of the LP position' },
                    adjustment: { type: 'string', description: 'Liquidity amount to remove (raw uint128 value)' },
                },
                required: ['chainName', 'accountAddress', 'assetAddress', 'assetId', 'adjustment'],
                additionalProperties: false,
            },
        },
    },
    {
        type: 'function',
        function: {
            name: 'stake',
            description: 'Stake, unstake, or claim rewards for an LP position in an Arcadia account.',
            strict: true,
            parameters: {
                type: 'object',
                properties: {
                    chainName: { type: 'string', enum: chainEnum, description: 'Chain name' },
                    accountAddress: { type: 'string', description: 'Arcadia account address' },
                    action: { type: 'string', enum: ['stake', 'unstake', 'claim'], description: 'Action to perform' },
                    assetAddress: { type: 'string', description: 'Position manager contract address' },
                    assetId: { type: 'number', description: 'NFT token ID of the LP position' },
                },
                required: ['chainName', 'accountAddress', 'action', 'assetAddress', 'assetId'],
                additionalProperties: false,
            },
        },
    },
    {
        type: 'function',
        function: {
            name: 'setAssetManagers',
            description: 'Enable or disable automated asset managers (rebalancer, compounder, yield claimer) on an Arcadia account.',
            strict: true,
            parameters: {
                type: 'object',
                properties: {
                    chainName: { type: 'string', enum: chainEnum, description: 'Chain name' },
                    accountAddress: { type: 'string', description: 'Arcadia account address' },
                    assetManagers: {
                        type: 'array',
                        items: { type: 'string' },
                        description: 'Asset manager contract addresses',
                    },
                    statuses: {
                        type: 'array',
                        items: { type: 'boolean' },
                        description: 'Enable (true) or disable (false) each asset manager',
                    },
                    datas: {
                        type: 'array',
                        items: { type: 'string' },
                        description: 'Encoded callback data for each asset manager (hex strings)',
                    },
                },
                required: ['chainName', 'accountAddress', 'assetManagers', 'statuses', 'datas'],
                additionalProperties: false,
            },
        },
    },
    // ── Asset manager intent encoding ───────────────────────────────
    {
        type: 'function',
        function: {
            name: 'encodeRebalancer',
            description: 'Encode args for the rebalancer automation. Returns { asset_managers, statuses, datas } to pass to setAssetManagers.',
            strict: true,
            parameters: {
                type: 'object',
                properties: {
                    chainName: { type: 'string', enum: chainEnum, description: 'Chain name' },
                    dexProtocol: {
                        type: 'string',
                        enum: ['slipstream', 'slipstream_v2', 'staked_slipstream', 'staked_slipstream_v2', 'uniV3', 'uniV4'],
                        description: 'DEX protocol of the LP position',
                    },
                    enabled: { type: 'boolean', description: 'True to enable, false to disable. Default true.' },
                },
                required: ['chainName', 'dexProtocol'],
                additionalProperties: false,
            },
        },
    },
    {
        type: 'function',
        function: {
            name: 'encodeCompounder',
            description: 'Encode args for the standalone compounder automation. Returns { asset_managers, statuses, datas } to pass to setAssetManagers.',
            strict: true,
            parameters: {
                type: 'object',
                properties: {
                    chainName: { type: 'string', enum: chainEnum, description: 'Chain name' },
                    dexProtocol: {
                        type: 'string',
                        enum: ['slipstream', 'slipstream_v2', 'staked_slipstream', 'staked_slipstream_v2', 'uniV3', 'uniV4'],
                        description: 'DEX protocol of the LP position',
                    },
                    enabled: { type: 'boolean', description: 'True to enable, false to disable. Default true.' },
                },
                required: ['chainName', 'dexProtocol'],
                additionalProperties: false,
            },
        },
    },
    {
        type: 'function',
        function: {
            name: 'encodeCompounderStaked',
            description:
                'Encode args for compounder coupled with CowSwap for staked LP positions. Returns { asset_managers, statuses, datas } with 2 entries (cowswapper + compounder) to pass to setAssetManagers.',
            strict: true,
            parameters: {
                type: 'object',
                properties: {
                    chainName: { type: 'string', enum: chainEnum, description: 'Chain name' },
                    dexProtocol: {
                        type: 'string',
                        enum: ['slipstream', 'slipstream_v2', 'staked_slipstream', 'staked_slipstream_v2', 'uniV3', 'uniV4'],
                        description: 'DEX protocol of the LP position',
                    },
                    sellTokens: {
                        type: 'array',
                        items: { type: 'string' },
                        description: 'Token addresses to sell via CowSwap (e.g. [AERO] for staked positions)',
                    },
                    buyToken: { type: 'string', description: 'Token address to buy (should be a major token in the pair)' },
                    enabled: { type: 'boolean', description: 'True to enable, false to disable. Default true.' },
                },
                required: ['chainName', 'dexProtocol', 'sellTokens', 'buyToken'],
                additionalProperties: false,
            },
        },
    },
    {
        type: 'function',
        function: {
            name: 'encodeYieldClaimer',
            description: 'Encode args for the standalone yield claimer automation. Returns { asset_managers, statuses, datas } to pass to setAssetManagers.',
            strict: true,
            parameters: {
                type: 'object',
                properties: {
                    chainName: { type: 'string', enum: chainEnum, description: 'Chain name' },
                    dexProtocol: {
                        type: 'string',
                        enum: ['slipstream', 'slipstream_v2', 'staked_slipstream', 'staked_slipstream_v2', 'uniV3', 'uniV4'],
                        description: 'DEX protocol of the LP position',
                    },
                    feeRecipient: { type: 'string', description: 'Address to receive claimed fees' },
                    enabled: { type: 'boolean', description: 'True to enable, false to disable. Default true.' },
                },
                required: ['chainName', 'dexProtocol', 'feeRecipient'],
                additionalProperties: false,
            },
        },
    },
    {
        type: 'function',
        function: {
            name: 'encodeYieldClaimerCowswap',
            description:
                'Encode args for yield claimer coupled with CowSwap. Returns { asset_managers, statuses, datas } with 2 entries (cowswapper + yield_claimer) to pass to setAssetManagers.',
            strict: true,
            parameters: {
                type: 'object',
                properties: {
                    chainName: { type: 'string', enum: chainEnum, description: 'Chain name' },
                    dexProtocol: {
                        type: 'string',
                        enum: ['slipstream', 'slipstream_v2', 'staked_slipstream', 'staked_slipstream_v2', 'uniV3', 'uniV4'],
                        description: 'DEX protocol of the LP position',
                    },
                    sellTokens: {
                        type: 'array',
                        items: { type: 'string' },
                        description: 'Token addresses to sell via CowSwap',
                    },
                    buyToken: { type: 'string', description: 'Token address to receive after swap' },
                    feeRecipient: { type: 'string', description: 'Address to receive claimed fees' },
                    enabled: { type: 'boolean', description: 'True to enable, false to disable. Default true.' },
                },
                required: ['chainName', 'dexProtocol', 'sellTokens', 'buyToken', 'feeRecipient'],
                additionalProperties: false,
            },
        },
    },
    {
        type: 'function',
        function: {
            name: 'encodeCowSwapper',
            description: 'Encode args for standalone direct CowSwap mode. Returns { asset_managers, statuses, datas } to pass to setAssetManagers.',
            strict: true,
            parameters: {
                type: 'object',
                properties: {
                    chainName: { type: 'string', enum: chainEnum, description: 'Chain name' },
                    enabled: { type: 'boolean', description: 'True to enable, false to disable. Default true.' },
                },
                required: ['chainName'],
                additionalProperties: false,
            },
        },
    },
    {
        type: 'function',
        function: {
            name: 'encodeMerklOperator',
            description: 'Encode args for the Merkl operator automation. Returns { asset_managers, statuses, datas } to pass to setAssetManagers.',
            strict: true,
            parameters: {
                type: 'object',
                properties: {
                    chainName: { type: 'string', enum: chainEnum, description: 'Chain name' },
                    rewardRecipient: { type: 'string', description: 'Address to receive Merkl rewards' },
                    enabled: { type: 'boolean', description: 'True to enable, false to disable. Default true.' },
                },
                required: ['chainName', 'rewardRecipient'],
                additionalProperties: false,
            },
        },
    },
] satisfies AdapterExport['tools'];
