import type { RequestHandler } from './$types';
import { PRIVATE_API_KEY } from '$env/static/private';

const MATCH_V5_API = `https://europe.api.riotgames.com/lol/match/v5/matches/EUW1_6727822954?api_key=${PRIVATE_API_KEY}`;

export const GET: RequestHandler = async ({ fetch }) => {
	return new Response();
};
