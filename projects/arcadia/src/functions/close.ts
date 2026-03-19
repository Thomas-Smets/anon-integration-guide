import { EVM, FunctionOptions, FunctionReturn, toResult } from '@heyanon/sdk';
import { resolveChain } from '../helpers/chains';
import { ERC8021_SUFFIX } from '../constants';
import { apiGet, apiPost } from '../helpers/api';

interface Props {
    chainName: string;
    accountAddress: string;
    receiveTokenAddress: string;
}

interface AccountSummary {
    account_address: string;
    creation_version: number;
    numeraire: string;
}

interface AccountOverview {
    owner: string;
    creditor: string;
    assets: Array<{ address: string; id: number; amount: string }>;
}

interface AssetInfo {
    address: string;
    decimals: number;
}

interface BundleResponse {
    calldata: string;
    fx_call_to: string;
    chain_id: number;
    tenderly_sim_status: string;
}

export async function close({ chainName, accountAddress, receiveTokenAddress }: Props, options: FunctionOptions): Promise<FunctionReturn> {
    const chainId = resolveChain(chainName);
    if (!chainId) {
        return toResult(`Unsupported chain: ${chainName}`, true);
    }

    const { notify, evm } = options;
    const { sendTransactions, getAddress } = evm!;
    const wallet = await getAddress();

    const overview = await apiGet<AccountOverview>('/accounts/overview', { chain_id: chainId, account: accountAddress });
    if (!overview.assets || overview.assets.length === 0) {
        return toResult('Account has no assets to close.', true);
    }

    const accountData = await apiGet<{ accounts: AccountSummary[] }>('/accounts', { chain_id: chainId, owner: overview.owner });
    const accountStub = accountData.accounts.find((a) => a.account_address.toLowerCase() === accountAddress.toLowerCase());
    if (!accountStub) return toResult(`Account ${accountAddress} not found`, true);

    const creditor = overview.creditor || '0x0000000000000000000000000000000000000000';

    // Resolve asset decimals
    const allAssets = await apiGet<AssetInfo[]>('/assets', { chain_id: chainId });
    const decimalsMap = new Map(allAssets.map((a) => [a.address.toLowerCase(), a.decimals]));

    const numeraireDecimals = decimalsMap.get(accountStub.numeraire.toLowerCase()) ?? 18;
    const receiveDecimals = decimalsMap.get(receiveTokenAddress.toLowerCase()) ?? 18;

    const sell = overview.assets.map((a) => ({
        asset_address: a.address,
        amount: String(a.amount),
        decimals: decimalsMap.get(a.address.toLowerCase()) ?? 1,
        asset_id: a.id || 0,
    }));

    const body = {
        buy: [
            {
                asset_address: receiveTokenAddress,
                distribution: 1,
                decimals: receiveDecimals,
                strategy_id: 0,
            },
        ],
        sell,
        deposits: { addresses: [], ids: [], amounts: [], decimals: [] },
        withdraws: { addresses: [], ids: [], amounts: [], decimals: [] },
        wallet_address: overview.owner,
        account_address: accountAddress,
        numeraire: accountStub.numeraire,
        numeraire_decimals: numeraireDecimals,
        debt: { take: false, leverage: 0, repay: -1, creditor },
        chain_id: chainId,
        version: accountStub.creation_version,
        action_type: 'account.closing-position',
        slippage: 100,
    };

    await notify!('Building close position transaction...');
    const result = await apiPost<BundleResponse>('/bundles/calldata', body);

    if (result.tenderly_sim_status === 'false') {
        return toResult('Transaction simulation failed. Try closing LP first, then swap and repay separately.', true);
    }

    const calldata = (result.calldata + ERC8021_SUFFIX) as `0x${string}`;
    const tx: EVM.types.TransactionParams = {
        target: result.fx_call_to as `0x${string}`,
        data: calldata,
    };

    await notify!('Waiting for transaction confirmation...');
    const txResult = await sendTransactions({ chainId, account: wallet, transactions: [tx] });
    const txData = txResult.data[txResult.data.length - 1];

    return toResult(`Position closed on ${accountAddress}. ${txData.message}`);
}
