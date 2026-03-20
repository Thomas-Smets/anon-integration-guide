import { EVM, FunctionOptions, FunctionReturn, toResult } from '@heyanon/sdk';
import { resolveChain } from '../helpers/chains';

const { checkToApprove } = EVM.utils;
import { parseUnits } from 'viem';
import { erc20Abi } from '../abis';
import { ERC8021_SUFFIX } from '../constants';
import { apiGet, apiPost } from '../helpers/api';

interface Props {
    chainName: string;
    accountAddress: string;
    strategyId: number;
    tokenAddress: string;
    amount: string;
    leverage: number;
}

interface AccountSummary {
    account_address: string;
    creation_version: number;
    numeraire: string;
}

interface Strategy {
    strategy_id: number;
    asset_address: string;
    asset_decimals: number;
}

interface BundleResponse {
    calldata: string;
    fx_call_to: string;
    chain_id: number;
    tenderly_sim_status: string;
}

/**
 * Opens an LP position on Arcadia with atomic deposit, swap, and LP mint.
 *
 * @param props - Function parameters
 * @param options - SDK function options (provider, signer, notifications)
 * @returns Result with transaction status and details
 */
export async function addLiquidity({ chainName, accountAddress, strategyId, tokenAddress, amount, leverage }: Props, options: FunctionOptions): Promise<FunctionReturn> {
    const chainId = resolveChain(chainName);
    if (!chainId) {
        return toResult(`Unsupported chain: ${chainName}`, true);
    }

    const { notify, evm } = options;
    const { sendTransactions, getProvider, getAddress } = evm;
    const wallet = await getAddress();
    const provider = getProvider(chainId);

    const decimals = await provider.readContract({
        address: tokenAddress as `0x${string}`,
        abi: erc20Abi,
        functionName: 'decimals',
    });
    const amountWei = parseUnits(amount, decimals);
    if (amountWei === 0n) return toResult('Amount must be greater than 0', true);

    // Look up account info and strategy
    const accountData = await apiGet<{ accounts: AccountSummary[] }>('/accounts', { chain_id: chainId, owner: wallet });
    const accountStub = accountData.accounts.find((a) => a.account_address.toLowerCase() === accountAddress.toLowerCase());
    if (!accountStub) return toResult(`Account ${accountAddress} not found for wallet ${wallet}`, true);

    const strategies = await apiGet<Strategy[]>('/strategies', { chain_id: chainId });
    const strategy = strategies.find((s) => s.strategy_id === strategyId);
    if (!strategy) return toResult(`Strategy ${strategyId} not found`, true);

    const overview = await apiGet<{ creditor: string }>('/accounts/overview', { chain_id: chainId, account: accountAddress });
    const creditor = overview.creditor || '0x0000000000000000000000000000000000000000';
    const isSpot = creditor === '0x0000000000000000000000000000000000000000';

    if (isSpot && leverage > 0) return toResult('Spot accounts cannot use leverage. Set leverage to 0.', true);

    // Resolve numeraire decimals
    const assets = await apiGet<Array<{ address: string; decimals: number }>>('/assets', { chain_id: chainId });
    const numeraireAsset = assets.find((a) => a.address.toLowerCase() === accountStub.numeraire.toLowerCase());
    const numeraireDecimals = numeraireAsset?.decimals ?? 18;

    const body = {
        buy: [
            {
                asset_address: strategy.asset_address,
                distribution: 1,
                decimals: strategy.asset_decimals,
                strategy_id: strategyId,
            },
        ],
        sell: [],
        deposits: {
            addresses: [tokenAddress],
            ids: [0],
            amounts: [amountWei.toString()],
            decimals: [decimals],
        },
        withdraws: { addresses: [], ids: [], amounts: [], decimals: [] },
        wallet_address: wallet,
        account_address: accountAddress,
        numeraire: accountStub.numeraire,
        numeraire_decimals: numeraireDecimals,
        debt: {
            take: !isSpot && leverage > 0,
            leverage: isSpot ? 1 : leverage,
            repay: 0,
            creditor,
        },
        chain_id: chainId,
        version: accountStub.creation_version,
        action_type: 'portfolio.advanced',
        slippage: 100,
    };

    await notify('Building add liquidity transaction...');
    const result = await apiPost<BundleResponse>('/bundles/calldata', body);

    if (result.tenderly_sim_status === 'false') {
        return toResult('Transaction simulation failed. Check balances and approvals.', true);
    }

    const transactions: EVM.types.TransactionParams[] = [];

    // Approve token for the account
    await checkToApprove({
        args: {
            account: wallet,
            target: tokenAddress as `0x${string}`,
            spender: accountAddress as `0x${string}`,
            amount: amountWei,
        },
        transactions,
        provider,
    });

    const calldata = (result.calldata + ERC8021_SUFFIX) as `0x${string}`;
    transactions.push({
        target: result.fx_call_to as `0x${string}`,
        data: calldata,
    });

    try {
        await notify('Waiting for transaction confirmation...');
        const txResult = await sendTransactions({ chainId, account: wallet, transactions });
        const txData = txResult.data[txResult.data.length - 1];
        if ('isMultisig' in txResult && txResult.isMultisig) {
            return toResult(txData.message);
        }
        return toResult(`LP position opened on strategy #${strategyId}. ${txData.message}`);
    } catch (error) {
        return toResult(`Failed to add liquidity: ${error instanceof Error ? error.message : 'Unknown error'}`, true);
    }
}
