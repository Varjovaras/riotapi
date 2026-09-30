import type { RequestHandler } from './$types';
import { PRIVATE_API_KEY } from '$env/static/private';
import { json } from '@sveltejs/kit';
import { gameDataSchema } from '$lib/schemas/gameDataSchema';
import { participantIdArraySchema } from '$lib/schemas/participantIdArraySchema';

export const GET: RequestHandler = async ({ fetch, url }) => {
	const matchId = url.searchParams.get('match');
	if (!matchId) {
		return new Response('No match id parameter in url', { status: 400 });
	}
	const API_URL = `https://europe.api.riotgames.com/lol/match/v5/matches/${matchId}?api_key=${PRIVATE_API_KEY}`;
	const response = await fetch(API_URL);
	if (response.status !== 200) {
		return response;
	}
	const data = await response.json();
	const gameData = gameDataSchema.parse(data.info.participants);
	const participantIds = participantIdArraySchema.parse(data.metadata.participants);
	return json({ gameData, participantIds });
};
