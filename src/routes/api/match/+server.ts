import type { RequestHandler } from './$types';
import { PRIVATE_API_KEY } from '$env/static/private';
import { json } from '@sveltejs/kit';
import { gameDataSchema } from '$lib/schemas/gameDataSchema';
import { participantIdArraySchema } from '$lib/schemas/participantIdArraySchema';

export const GET: RequestHandler = async ({ fetch, url }) => {
	const matchId = url.searchParams.get('match');
	console.log('[api/match] request received', { matchId });
	if (!matchId) {
		console.log('[api/match] missing match query parameter');
		return new Response('No match id parameter in url', { status: 400 });
	}
	const API_URL = `https://europe.api.riotgames.com/lol/match/v5/matches/${matchId}?api_key=${PRIVATE_API_KEY}`;
	console.log('[api/match] calling Riot API', { path: new URL(API_URL).pathname });
	const response = await fetch(API_URL);
	console.log('[api/match] Riot API responded', { status: response.status });
	if (response.status !== 200) {
		console.log('[api/match] non-200 response, passing it through');
		return response;
	}
	const data = await response.json();
	console.log('[api/match] raw match data received', {
		matchId: data.metadata?.matchId,
		dataVersion: data.metadata?.dataVersion,
		gameMode: data.info?.gameMode,
		participants: data.info?.participants?.length
	});
	const gameData = gameDataSchema.parse(data.info.participants);
	const participantIds = participantIdArraySchema.parse(data.metadata.participants);
	console.log('[api/match] parsed match data', {
		participants: gameData.length,
		players: gameData.map((player) => `${player.riotIdGameName} (${player.teamId})`),
		participantIds
	});
	return json({ gameData, participantIds });
};
