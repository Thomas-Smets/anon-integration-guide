import { FunctionOptions, FunctionReturn, toResult } from '@heyanon/sdk';
import { resolveChain } from '../helpers/chains';
import { apiGet } from '../helpers/api';

interface Props {
    chainName: string;
}

interface PointsData {
    points: number;
    wallet_address: string;
}

export async function getWalletPoints({ chainName }: Props, { evm: { getAddress } }: FunctionOptions): Promise<FunctionReturn> {
    const chainId = resolveChain(chainName);
    if (!chainId) {
        return toResult(`Unsupported chain: ${chainName}`, true);
    }

    const wallet = await getAddress();
    const data = await apiGet<PointsData>('/points', { wallet_address: wallet });

    return toResult(`Wallet: ${wallet}\nPoints: ${data.points}`);
}
