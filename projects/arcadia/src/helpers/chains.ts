import { EVM, EvmChain } from '@heyanon/sdk';
import { SUPPORTED_CHAINS } from '../constants';

const { getChainFromName } = EVM.utils;

export function resolveChain(chainName: string): number | null {
    try {
        const chainId = getChainFromName(chainName as EvmChain);
        if (!SUPPORTED_CHAINS.includes(chainId as (typeof SUPPORTED_CHAINS)[number])) return null;
        return chainId;
    } catch {
        return null;
    }
}
