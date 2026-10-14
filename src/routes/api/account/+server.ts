import type { RequestHandler } from './$types';
import { PRIVATE_API_KEY } from '$app/env/private';
import { isRegion, regionalHost } from '#lib/utils/regions.js';

export const GET: RequestHandler = async ({ fetch, url }) => {
    const riotIdName = url.searchParams.get('name');
    const riotIdTag = url.searchParams.get('tag');
    const region = url.searchParams.get('region')?.toLowerCase();
    console.log('[api/account] request received', { name: riotIdName, tag: riotIdTag, region });
    if (!riotIdName || !riotIdTag || !region) {
        console.log('[api/account] missing name, tag or region query parameter');
        return new Response('No riot id name, tag or region parameters in url', {
            status: 400
        });
    }
    if (!isRegion(region)) {
        console.log('[api/account] unknown region', { region });
        return new Response(`Unknown region "${region}"`, { status: 400 });
    }
    const ACCOUNT_API_URL = `https://${regionalHost(region)}/riot/account/v1/accounts/by-riot-id/${encodeURIComponent(riotIdName)}/${encodeURIComponent(riotIdTag)}?api_key=${PRIVATE_API_KEY}`;
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
    return Response.json(data.puuid);
};
