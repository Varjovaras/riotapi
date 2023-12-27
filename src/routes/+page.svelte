<script lang="ts">
	import { z } from 'zod';
	import type { GameData, ParticipantIds, Ping } from '../types/types';
	import { gameDataSchema } from '../schemas/gameDataSchema';

	const ACCOUNT_API = '/api/account';
	const MATCH_API = `/api/match/`;

	let name = '';
	let tag = '';

	let playerStats: GameData = [];

	let playerIds: ParticipantIds = [];
	let puuId = '';

	$: totalMissingPings = playerStats
		.map((participant) => participant.enemyMissingPings)
		.reduce((total, pings) => total + pings, 0);
	$: totalBasicPings = playerStats
		.map((participant) => participant.basicPings)
		.reduce((total, pings) => total + pings, 0);
	$: totalDangerPings = playerStats
		.map((participant) => participant.dangerPings)
		.reduce((total, pings) => total + pings, 0);
	$: totalAllInPings = playerStats
		.map((participant) => participant.allInPings)
		.reduce((total, pings) => total + pings, 0);
	$: totalGetBackPings = playerStats
		.map((participant) => participant.getBackPings)
		.reduce((total, pings) => total + pings, 0);
	$: totalNeedVisionPings = playerStats
		.map((participant) => participant.needVisionPings)
		.reduce((total, pings) => total + pings, 0);
	$: totalOnMyWayPings = playerStats
		.map((participant) => participant.onMyWayPings)
		.reduce((total, pings) => total + pings, 0);
	$: totalAssistMePings = playerStats
		.map((participant) => participant.assistMePings)
		.reduce((total, pings) => total + pings, 0);
	$: totalPushPings = playerStats
		.map((participant) => participant.pushPings)
		.reduce((total, pings) => total + pings, 0);

	async function fetchMatchApi() {
		//example match
		const matchId = 'EUW1_6727822954';
		const response = await fetch(`${MATCH_API}?match=${matchId}`);
		const data = await response.json();
		console.log(data);
		const gameData: GameData = gameDataSchema.parse(data);
		playerStats = gameData;
	}

	async function fetchAccountApi() {
		const response = await fetch(ACCOUNT_API);
		const data = await response.json();
		console.log(data);
		const dataString = z.string().parse(data.puuid);
		return dataString;
	}
</script>

<div class="flex min-h-screen flex-col items-center justify-center py-2">
	<form class="mb-4 rounded px-8 pb-8 pt-6 shadow-md">
		<div class="mb-4">
			<label class="mb-2 block text-sm font-bold text-gray-700" for="Summoner name">
				Summoner name
			</label>
			<input
				class="focus:shadow-outline w-full appearance-none rounded border px-3 py-2 leading-tight text-gray-700 shadow focus:outline-none"
				id="username"
				type="text"
				placeholder="Summoner name"
				bind:value={name}
			/>
		</div>
		<div class="mb-6">
			<label class="mb-2 block text-sm font-bold text-gray-700" for="tag"> tag </label>
			<input
				class="focus:shadow-outline mb-3 w-full appearance-none rounded border border-red-500 px-3 py-2 leading-tight text-gray-700 shadow focus:outline-none"
				id="tag"
				type="text"
				placeholder="Riot id # tag"
			/>
			<p class="text-xs italic text-red-500">For example: Hide on Bush #420</p>
		</div>
		<button
			class="w-full rounded border border-gray-400 bg-white px-4 py-2 font-semibold text-gray-800 shadow hover:bg-gray-300"
			type="button"
			on:click={fetchMatchApi}
		>
			Fetch match details
		</button>
		<button
			class="w-full rounded border border-gray-400 bg-white px-4 py-2 font-semibold text-gray-800 shadow hover:bg-gray-300"
			type="button"
			on:click={fetchAccountApi}
		>
			Fetch account details
		</button>
	</form>

	{#if puuId}
		<div>puuid: {puuId}</div>
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
