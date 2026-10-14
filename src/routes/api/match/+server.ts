import type { RequestHandler } from './$types';
import { PRIVATE_API_KEY } from '$app/env/private';
import { gameDataSchema } from '#lib/schemas/gameDataSchema.js';
import { participantIdArraySchema } from '#lib/schemas/participantIdArraySchema.js';
import { isRegion, regionalHost } from '#lib/utils/regions.js';

export const GET: RequestHandler = async ({ fetch, url }) => {
    const matchId = url.searchParams.get('match');
    const region = url.searchParams.get('region')?.toLowerCase();
    console.log('[api/match] request received', { matchId, region });
    if (!matchId || !region) {
        console.log('[api/match] missing match or region query parameter');
        return new Response('No match id or region parameter in url', {
            status: 400
        });
    }
    if (!isRegion(region)) {
        console.log('[api/match] unknown region', { region });
        return new Response(`Unknown region "${region}"`, { status: 400 });
    }
    const API_URL = `https://${regionalHost(region)}/lol/match/v5/matches/${matchId}?api_key=${PRIVATE_API_KEY}`;
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
    // Riot removed the bait ping (patch 13.19) and now reports its replacement
    // as retreatPings, so fall back to it when baitPings is missing.
    const participants = data.info.participants.map((participant: Record<string, unknown>) => ({
        ...participant,
        baitPings: participant.baitPings ?? participant.retreatPings ?? 0
    }));
    const gameData = gameDataSchema.parse(participants);
    const participantIds = participantIdArraySchema.parse(data.metadata.participants);
    console.log('[api/match] parsed match data', {
        participants: gameData.length,
        players: gameData.map((player) => `${player.riotIdGameName} (${player.teamId})`),
        participantIds
    });
    return Response.json({ gameData, participantIds });
};
