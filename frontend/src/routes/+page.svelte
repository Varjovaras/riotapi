<script lang="ts">
	import { PUBLIC_API_KEY, PUBLIC_NAME, PUBLIC_TAG } from '$env/static/public';
	import { z } from 'zod';
	import type { GameData, ParticipantIds, Ping } from '../types/types';
	import { GameDataSchema } from '../schemas/gameDataSchema';

	let name = '';
	let tag = '';

	const matchv5Api = `https://europe.api.riotgames.com/lol/match/v5/matches/EUW1_6727822954?api_key=${PUBLIC_API_KEY}`;
	const accountApi = `https://europe.api.riotgames.com/riot/account/v1/accounts/by-riot-id/fentanyl420/420?api_key=${PUBLIC_API_KEY}}`;
	let playerStats: GameData = [];

	let playerIds: ParticipantIds = [];
	let puuId = '';

	const getTotalPings = (type: Ping) => {
		return playerStats
			.map((participant) => participant[type])
			.reduce((total, pings) => total + pings, 0);
	};

	$: totalMissingPings = getTotalPings('enemyMissingPings');
	$: totalBasicPings = getTotalPings('basicPings');
	$: totalDangerPings = getTotalPings('dangerPings');
	$: totalAllInPings = getTotalPings('allInPings');
	$: totalGetBackPings = getTotalPings('getBackPings');
	$: totalNeedVisionPings = getTotalPings('needVisionPings');
	$: totalOnMyWayPings = getTotalPings('onMyWayPings');
	$: totalAssistMePings = getTotalPings('assistMePings');
	$: totalPushPings = getTotalPings('pushPings');

	// const ali = (num: number) => {};

	async function fetchAccountApi() {
		const response = await fetch(accountApi);
		const data = await response.json();
		console.log(data);
		const dataString = z.string().parse(data.puuid);
		return dataString;
	}

	async function fetchMatchApi() {
		const response = await fetch(matchv5Api);
		const data = await response.json();
		const participantIds: ParticipantIds = z.array(z.string()).parse(data.metadata.participants);

		const participants: GameData = GameDataSchema.parse(data.info.participants);
		playerStats = participants;
		// PlayerDataSchema;
		playerIds = participantIds;
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
