import type { RequestHandler } from './$types';
import { PRIVATE_API_KEY } from '$env/static/private';
import { json } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ fetch, url }) => {
	const riotIdName = url.searchParams.get('name');
	const riotIdTag = url.searchParams.get('tag');
	if (!riotIdName || !riotIdTag) {
		return new Response('No riot id name or tag parameters in url', {
			status: 400
		});
	}
	const ACCOUNT_API_URL = `https://europe.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${encodeURIComponent(riotIdName)}/${encodeURIComponent(riotIdTag)}?api_key=${PRIVATE_API_KEY}`;

	const response = await fetch(ACCOUNT_API_URL);
	if (response.status !== 200) {
		return response;
	}
	const data = await response.json();
	return json(data.puuid);
};
