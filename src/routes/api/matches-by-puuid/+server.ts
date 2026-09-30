import { PRIVATE_API_KEY } from '$env/static/private';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

/**
 * API for riot MATCH-V5 to get a list of match ids played by given puuid. Also possible to filter when the games are played
 */
export const GET: RequestHandler = async ({ fetch, url }) => {
	const puuid = url.searchParams.get('puuid');
	const start = url.searchParams.get('start') || '0';
	const count = url.searchParams.get('count') || '20';
	console.log('[api/matches-by-puuid] request received', { puuid, start, count });
	if (!puuid) {
		console.log('[api/matches-by-puuid] missing puuid query parameter');
		return new Response('No puuid in url', { status: 400 });
	}
	const MATCH_V5_API_URL = `https://europe.api.riotgames.com/lol/match/v5/matches/by-puuid/${puuid}/ids?start=${start}&count=${count}&api_key=${PRIVATE_API_KEY}`;
	console.log('[api/matches-by-puuid] calling Riot API', {
		path: new URL(MATCH_V5_API_URL).pathname,
		start,
		count
	});
	const response = await fetch(MATCH_V5_API_URL);
	console.log('[api/matches-by-puuid] Riot API responded', { status: response.status });
	if (response.status !== 200) {
		console.log('[api/matches-by-puuid] non-200 response, passing it through');
		return response;
	}
	const data = await response.json();
	console.log('[api/matches-by-puuid] match ids received', {
		amount: data.length,
		matchIds: data
	});
	return json(data);
};
