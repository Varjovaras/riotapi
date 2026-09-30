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
	if (!puuid) {
		return new Response('No puuid in url', { status: 400 });
	}
	const MATCH_V5_API_URL = `https://europe.api.riotgames.com/lol/match/v5/matches/by-puuid/${puuid}/ids?start=${start}&count=${count}&api_key=${PRIVATE_API_KEY}`;
	const response = await fetch(MATCH_V5_API_URL);
	if (response.status !== 200) {
		return response;
	}
	const data = await response.json();
	return json(data);
};
