import { error } from '@sveltejs/kit';
import { z } from 'zod';
import { gameDataSchema } from '$lib/schemas/gameDataSchema';
import type { GameData } from '$lib/utils/types';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch, url }) => {
	const puuid = url.searchParams.get('puuid');
	if (!puuid) {
		error(400, 'No puuid in url');
	}
	console.log('[matches] loading matches for puuid', { puuid });

	const matchesUrl = `/api/matches-by-puuid?${new URLSearchParams({ puuid })}`;
	console.log('[matches] fetching match ids', { url: matchesUrl });
	const matchesResponse = await fetch(matchesUrl);
	console.log('[matches] match ids response', { status: matchesResponse.status });
	if (!matchesResponse.ok) {
		error(matchesResponse.status, 'Failed to fetch the list of matches');
	}
	const latestMatches = z.array(z.string()).parse(await matchesResponse.json());
	console.log('[matches] match ids received', { amount: latestMatches.length });

	const match = url.searchParams.get('match') ?? '';
	let gameData: GameData = [];
	if (match) {
		const matchUrl = `/api/match?${new URLSearchParams({ match })}`;
		console.log('[matches] fetching match', { url: matchUrl });
		const matchResponse = await fetch(matchUrl);
		console.log('[matches] match response', { status: matchResponse.status });
		if (!matchResponse.ok) {
			error(matchResponse.status, `Failed to fetch match ${match}`);
		}
		const data = await matchResponse.json();
		gameData = gameDataSchema.parse(data.gameData);
	}

	return { puuid, latestMatches, match, gameData };
};
