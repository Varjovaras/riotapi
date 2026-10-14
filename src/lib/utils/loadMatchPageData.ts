import { error } from '@sveltejs/kit';
import { z } from 'zod';
import { gameDataSchema } from '#lib/schemas/gameDataSchema.js';
import type { GameData } from '#lib/utils/types.js';

export type MatchPageData = {
    puuid: string;
    latestMatches: string[];
    match: string;
    gameData: GameData;
};

type LoadMatchPageDataInput = {
    fetch: typeof fetch;
    url: URL;
};

/**
 * Shared loader for the /matches and /pings pages. Both read the same `puuid`
 * and `match` search params from the url so links keep pointing at the right
 * account and game whichever page they land on.
 */
export async function loadMatchPageData({
    fetch,
    url
}: LoadMatchPageDataInput): Promise<MatchPageData> {
    const puuid = url.searchParams.get('puuid');
    if (!puuid) {
        error(400, 'No puuid in url');
    }
    console.log('[match-page] loading matches for puuid', { puuid });

    const matchesUrl = `/api/matches-by-puuid?${new URLSearchParams({ puuid })}`;
    console.log('[match-page] fetching match ids', { url: matchesUrl });
    const matchesResponse = await fetch(matchesUrl);
    console.log('[match-page] match ids response', { status: matchesResponse.status });
    if (!matchesResponse.ok) {
        error(matchesResponse.status, 'Failed to fetch the list of matches');
    }
    const latestMatches = z.array(z.string()).parse(await matchesResponse.json());
    console.log('[match-page] match ids received', { amount: latestMatches.length });

    const match = url.searchParams.get('match') ?? '';
    let gameData: GameData = [];
    if (match) {
        const matchUrl = `/api/match?${new URLSearchParams({ match })}`;
        console.log('[match-page] fetching match', { url: matchUrl });
        const matchResponse = await fetch(matchUrl);
        console.log('[match-page] match response', {
            status: matchResponse.status
        });
        if (!matchResponse.ok) {
            error(matchResponse.status, `Failed to fetch match ${match}`);
        }
        const data = await matchResponse.json();
        gameData = gameDataSchema.parse(data.gameData);
    }

    return { puuid, latestMatches, match, gameData };
}
