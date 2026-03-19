import { FunctionOptions, FunctionReturn, toResult } from '@heyanon/sdk';
import { resolveChain } from '../helpers/chains';
import { formatUnits } from 'viem';
import { erc20Abi } from '../abis';
import { TOKENS } from '../constants';

interface Props {
    chainName: string;
}

export async function getWalletBalances({ chainName }: Props, options: FunctionOptions): Promise<FunctionReturn> {
    const chainId = resolveChain(chainName);
    if (!chainId) {
        return toResult(`Unsupported chain: ${chainName}`, true);
    }

    const {
        evm: { getProvider, getAddress },
    } = options;
    const wallet = await getAddress();
    const provider = getProvider(chainId);

    const entries = Object.entries(TOKENS);
    const balances = await Promise.all(
        entries.map(async ([symbol, token]) => {
            const raw = await provider.readContract({
                address: token.address,
                abi: erc20Abi,
                functionName: 'balanceOf',
                args: [wallet as `0x${string}`],
            });
            return { symbol, balance: formatUnits(raw as bigint, token.decimals) };
        }),
    );

    const lines = balances.map((b) => `  ${b.symbol}: ${b.balance}`);
    return toResult(`Wallet ${wallet} balances on ${chainName}:\n${lines.join('\n')}`);
}
