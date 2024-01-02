import { PRIVATE_API_KEY } from '$env/static/private';
import type { RequestHandler } from '@sveltejs/kit';
import type { GameData } from '../../../types/types';

// type Response = {
// 	gameData: GameData;
// 	participantIds: string[];
// };

/**
 * API for riot MATCH-V5 to get a list of match ids played by given puuid. Also possible to filter when the games are played
 */
export const GET: RequestHandler = async ({ fetch, url }) => {
	const puuid = url.searchParams.get('puuid');
	if (!puuid) {
		return new Response('No puuid in url', { status: 400 });
	}
	let start = url.searchParams.get('start');
	if (!start) {
		start = '0';
	}
	let count = url.searchParams.get('count');
	if (!start) {
		count = '20';
	}
	const API_URL = `https://europe.api.riotgames.com/lol/match/v5/matches/by-puuid/${puuid}/ids?start=${start}&count=${count}&api_key=${PRIVATE_API_KEY}`;
	const response = await fetch(API_URL);
	const data = await response.json();
	return new Response(JSON.stringify(data));
};
