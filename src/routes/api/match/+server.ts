import type { RequestHandler } from './$types';
import { PRIVATE_API_KEY } from '$env/static/private';
import { gameDataSchema } from '../../../schemas/gameDataSchema';
import type { GameData } from '../../../types/types';

export const GET: RequestHandler = async ({ fetch, url }) => {
	const matchId = url.searchParams.get('match');
	if (!matchId) {
		return new Response('No match id parameter in url', { status: 404 });
	}
	const API_URL = `https://europe.api.riotgames.com/lol/match/v5/matches/${matchId}?api_key=${PRIVATE_API_KEY}`;

	const response = await fetch(API_URL);
	const data = await response.json();
	const gameData = gameDataSchema.parse(data.info.participants);
	return new Response(JSON.stringify(gameData));
};
