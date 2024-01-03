import type { RequestHandler } from './$types';
import { PRIVATE_API_KEY } from '$env/static/private';
import { z } from 'zod';

// const ACCOUNT_API = `https://europe.api.riotgames.com/riot/account/v1/accounts/by-riot-id/fentanyl420/420?api_key=${PRIVATE_API_KEY}}`;

export const GET: RequestHandler = async ({ fetch, url }) => {
	const riotIdName = url.searchParams.get('name');
	const riotIdTag = url.searchParams.get('tag');
	if (!riotIdName || !riotIdTag) {
		return new Response('No riot id name or tag parameters in url', {
			status: 400
		});
	}
	const ACCOUNT_API_URL = `https://europe.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${riotIdName}/${riotIdTag}?api_key=${PRIVATE_API_KEY}`;
	const response = await fetch(ACCOUNT_API_URL);
	const data = await response.json();
	const puuid = data.puuid;
	return new Response(JSON.stringify(puuid));
};
