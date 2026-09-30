import type { RequestHandler } from './$types';
import { PRIVATE_API_KEY } from '$env/static/private';
import { json } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ fetch, url }) => {
	const riotIdName = url.searchParams.get('name');
	const riotIdTag = url.searchParams.get('tag');
	console.log('[api/account] request received', { name: riotIdName, tag: riotIdTag });
	if (!riotIdName || !riotIdTag) {
		console.log('[api/account] missing name or tag query parameter');
		return new Response('No riot id name or tag parameters in url', {
			status: 400
		});
	}
	const ACCOUNT_API_URL = `https://europe.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${encodeURIComponent(riotIdName)}/${encodeURIComponent(riotIdTag)}?api_key=${PRIVATE_API_KEY}`;
	console.log('[api/account] calling Riot API', {
		path: new URL(ACCOUNT_API_URL).pathname
	});

	const response = await fetch(ACCOUNT_API_URL);
	console.log('[api/account] Riot API responded', { status: response.status });
	if (response.status !== 200) {
		console.log('[api/account] non-200 response, passing it through');
		return response;
	}
	const data = await response.json();
	console.log('[api/account] account found', {
		gameName: data.gameName,
		tagLine: data.tagLine,
		puuid: data.puuid
	});
	return json(data.puuid);
};
