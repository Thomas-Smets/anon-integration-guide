import { FunctionOptions, FunctionReturn, toResult } from '@heyanon/sdk';
import { resolveChain } from '../helpers/chains';
import { formatUnits } from 'viem';
import { erc20Abi } from '../abis';
import { TOKENS } from '../constants';

interface Props {
    chainName: string;
    spender: string;
}

export async function getWalletAllowances({ chainName, spender }: Props, options: FunctionOptions): Promise<FunctionReturn> {
    const chainId = resolveChain(chainName);
    if (!chainId) {
        return toResult(`Unsupported chain: ${chainName}`, true);
    }

    if (!spender) return toResult('spender is required', true);

    const {
        evm: { getProvider, getAddress },
    } = options;
    const wallet = await getAddress();
    const provider = getProvider(chainId);

    const entries = Object.entries(TOKENS);
    const allowances = await Promise.all(
        entries.map(async ([symbol, token]) => {
            const raw = await provider.readContract({
                address: token.address,
                abi: erc20Abi,
                functionName: 'allowance',
                args: [wallet as `0x${string}`, spender as `0x${string}`],
            });
            return { symbol, allowance: formatUnits(raw as bigint, token.decimals) };
        }),
    );

    const lines = allowances.map((a) => `  ${a.symbol}: ${a.allowance}`);
    return toResult(`Wallet ${wallet} allowances for ${spender} on ${chainName}:\n${lines.join('\n')}`);
}
