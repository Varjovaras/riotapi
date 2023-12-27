<script lang="ts">
	import { z } from 'zod';
	import type { GameData, ParticipantIdArray, Ping } from '../types/types';
	import { gameDataSchema } from '../schemas/gameDataSchema';
	import { participantIdArraySchema } from '../schemas/participantIdArraySchema';

	const ACCOUNT_API = '/api/account';
	const MATCH_API = `/api/match/`;

	let riotIdName = '';
	let riotIdTag = '';
	let puuid = '';

	let playerStats: GameData = [];
	let playerIds: ParticipantIdArray = [];

	function calculateTotalPings(playerStats: GameData, pingType: Ping): number {
		return playerStats
			.map((participant) => participant[pingType])
			.reduce((total, pings) => total + pings, 0);
	}
	$: totalMissingPings = calculateTotalPings(playerStats, 'enemyMissingPings');
	$: totalBasicPings = calculateTotalPings(playerStats, 'basicPings');
	$: totalDangerPings = calculateTotalPings(playerStats, 'dangerPings');
	$: totalAllInPings = calculateTotalPings(playerStats, 'allInPings');
	$: totalGetBackPings = calculateTotalPings(playerStats, 'getBackPings');
	$: totalNeedVisionPings = calculateTotalPings(playerStats, 'needVisionPings');
	$: totalOnMyWayPings = calculateTotalPings(playerStats, 'onMyWayPings');
	$: totalAssistMePings = calculateTotalPings(playerStats, 'assistMePings');
	$: totalPushPings = calculateTotalPings(playerStats, 'pushPings');

	async function fetchAccountApi() {
		const response = await fetch(`${ACCOUNT_API}?name=${riotIdName}&tag=${riotIdTag}`);

		const data = await response.json();
		const puuidFromServer = z.string().parse(data);
		puuid = puuidFromServer;
	}

	async function fetchMatchApi() {
		//example match
		const matchId = 'EUW1_6727822954';
		const response = await fetch(`${MATCH_API}?match=${matchId}`);
		const data = await response.json();
		const gameData = gameDataSchema.parse(data.gameData);
		const playerIdsFromServer = participantIdArraySchema.parse(data.participantIds);
		playerStats = gameData;
		playerIds = playerIdsFromServer;
	}
</script>

<div class="flex min-h-screen flex-col items-center justify-center py-2">
	<div class="mb-4 rounded px-8 pb-8 pt-6 shadow-md">
		<div class="mb-4">
			<label class="mb-2 block text-sm font-bold text-gray-700" for="Summoner name">
				Summoner name
			</label>
			<input
				class="focus:shadow-outline w-full appearance-none rounded border px-3 py-2 leading-tight text-gray-700 shadow focus:outline-none"
				id="username"
				type="text"
				placeholder="Summoner name"
				bind:value={riotIdName}
			/>
		</div>
		<div class="mb-6">
			<label class="mb-2 block text-sm font-bold text-gray-700" for="tag"> tag </label>
			<input
				class="focus:shadow-outline mb-3 w-full appearance-none rounded border border-red-500 px-3 py-2 leading-tight text-gray-700 shadow focus:outline-none"
				id="tag"
				type="text"
				placeholder="Riot id # tag"
				bind:value={riotIdTag}
			/>
			<p class="text-xs italic text-red-500">For example: Hide on Bush #420</p>
		</div>

		<button
			class="mb-2 w-full rounded border border-gray-400 bg-white px-4 py-2 font-semibold text-gray-800 shadow hover:bg-gray-300"
			type="button"
			on:click={fetchAccountApi}
		>
			Fetch account details
		</button>

		<div class="mb-4">todo match details</div>
		<button
			class="w-full rounded border border-gray-400 bg-white px-8 py-2 font-semibold text-gray-800 shadow hover:bg-gray-300"
			type="button"
			on:click={fetchMatchApi}
		>
			Fetch match details
		</button>
	</div>

	{#if puuid}
		<div>puuid: {puuid}</div>
	{/if}
	<div>total basic pings: {totalBasicPings}</div>
	<div>total missing pings: {totalMissingPings}</div>
	<div>total danger pings: {totalDangerPings}</div>
	<div>total all in pings: {totalAllInPings}</div>
	<div>total get back pings: {totalGetBackPings}</div>
	<div>total need vision pings: {totalNeedVisionPings}</div>
	<div>total on my way pings: {totalOnMyWayPings}</div>
	<div>total assist me pings: {totalAssistMePings}</div>
	<div>total push pings: {totalPushPings}</div>
</div>
