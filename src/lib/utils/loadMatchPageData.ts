import { error } from '@sveltejs/kit';
import { z } from 'zod';
import { gameDataSchema } from '#lib/schemas/gameDataSchema.js';
import { isRegion } from '#lib/utils/regions.js';
import type { GameData } from '#lib/utils/types.js';

export type MatchPageData = {
    region: string;
    name: string;
    tag: string;
    puuid: string;
    latestMatches: string[];
    match: string;
    gameData: GameData;
};

type LoadMatchPageDataInput = {
    fetch: typeof fetch;
    params: Record<string, string>;
    url: URL;
};

/**
 * Shared loader for the /matches and /pings pages. Both read `region`, `name` and
 * `tag` from the route params and `match` from the query string, so a link keeps
 * pointing at the right account and game whichever page it lands on. The Riot ID
 * is resolved to a puuid here, which is why the url never needs to carry one.
 */
export async function loadMatchPageData({
    fetch,
    params,
    url
}: LoadMatchPageDataInput): Promise<MatchPageData> {
    const { name, tag } = params;
    const region = params.region?.toLowerCase();
    if (!region || !name || !tag) {
        error(400, 'Url must include a region, name and tag');
    }
    if (!isRegion(region)) {
        error(404, `Unknown region "${region}"`);
    }
    console.log('[match-page] resolving account', { region, name, tag });

    const accountUrl = `/api/account?${new URLSearchParams({ name, tag, region })}`;
    const accountResponse = await fetch(accountUrl);
    console.log('[match-page] account response', { status: accountResponse.status });

    if (accountResponse.status === 404) {
        error(404, `No account found for ${name}#${tag}`);
    }
    if (!accountResponse.ok) {
        error(accountResponse.status, `Failed to look up ${name}#${tag}`);
    }

    const puuid = z.string().parse(await accountResponse.json());
    const matchesUrl = `/api/matches-by-puuid?${new URLSearchParams({ puuid, region })}`;

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
        const matchUrl = `/api/match?${new URLSearchParams({ match, region })}`;
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

    return { region, name, tag, puuid, latestMatches, match, gameData };
}
