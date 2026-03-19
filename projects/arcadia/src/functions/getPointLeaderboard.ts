import { FunctionOptions, FunctionReturn, toResult } from '@heyanon/sdk';
import { resolveChain } from '../helpers/chains';
import { apiGet } from '../helpers/api';

interface Props {
    chainName: string;
}

interface LeaderboardEntry {
    user_address: string;
    total_points: number;
    amount_referred: number;
    points_referred: number;
}

export async function getPointLeaderboard({ chainName }: Props, _options: FunctionOptions): Promise<FunctionReturn> {
    const chainId = resolveChain(chainName);
    if (!chainId) {
        return toResult(`Unsupported chain: ${chainName}`, true);
    }

    const data = await apiGet<LeaderboardEntry[]>('/points/leaderboard');

    if (!data || data.length === 0) {
        return toResult('No leaderboard data available.');
    }

    const top = data.slice(0, 20);
    const lines = top.map((e, i) => `  #${i + 1} ${e.user_address}: ${e.total_points} pts`);

    return toResult(`Arcadia Points Leaderboard (top ${top.length}):\n${lines.join('\n')}`);
}
