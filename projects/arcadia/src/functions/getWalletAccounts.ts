import { FunctionOptions, FunctionReturn, toResult } from '@heyanon/sdk';
import { resolveChain } from '../helpers/chains';

import { apiGet } from '../helpers/api';

interface Props {
    chainName: string;
}

interface AccountSummary {
    account_address: string;
    creation_version: number;
    numeraire: string;
}

export async function getWalletAccounts({ chainName }: Props, { evm: { getAddress } }: FunctionOptions): Promise<FunctionReturn> {
    const chainId = resolveChain(chainName);
    if (!chainId) {
        return toResult(`Unsupported chain: ${chainName}`, true);
    }

    const wallet = await getAddress();
    const data = await apiGet<{ accounts: AccountSummary[] }>('/accounts', { chain_id: chainId, owner: wallet });
    const accounts = data.accounts;

    if (!accounts || accounts.length === 0) {
        return toResult(`No Arcadia accounts found for wallet ${wallet} on ${chainName}.`);
    }

    const lines = accounts.map((a) => `- ${a.account_address} (v${a.creation_version})`);
    return toResult(`Found ${accounts.length} Arcadia account(s) on ${chainName}:\n${lines.join('\n')}`);
}
