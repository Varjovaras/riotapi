<script lang="ts">
	import { PUBLIC_API_KEY, PUBLIC_NAME, PUBLIC_TAG } from '$env/static/public';
	import { z } from 'zod';
	import { GameDataSchema, type GameData } from '../schemas/gameDataSchema';

	type ParticipantIds = String[];

	let name = '';
	let tag = '';

	const accountApi = `https://europe.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${name}/${tag}?api_key=${PUBLIC_API_KEY}`;
	const matchv5Api = `https://europe.api.riotgames.com/lol/match/v5/matches/EUW1_6727822954?api_key=${PUBLIC_API_KEY}`;

	let playerStats: GameData = [];
	let playerIds: ParticipantIds = [];

	// $: missingPings = playerStats.map((participant) => participant.enemyMissingPings);
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

	// const ali = (num: number) => {};

	async function fetchAccountApi() {
		const response = await fetch(accountApi);
		const data = await response.json();
		const participantIds: ParticipantIds = z.array(z.string()).parse(data.metadata.participants);

		const participants: GameData = GameDataSchema.parse(data.info.participants);
		return {
			participantIds,
			participants
		};
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

<div class="flex flex-col items-center justify-center min-h-screen py-2">
	<form class="shadow-md rounded px-8 pt-6 pb-8 mb-4">
		<div class="mb-4">
			<label class="block text-gray-700 text-sm font-bold mb-2" for="Summoner name">
				Summoner name
			</label>
			<input
				class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
				id="username"
				type="text"
				placeholder="Summoner name"
				bind:value={name}
			/>
		</div>
		<div class="mb-6">
			<label class="block text-gray-700 text-sm font-bold mb-2" for="tag"> tag </label>
			<input
				class="shadow appearance-none border border-red-500 rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
				id="tag"
				type="text"
				placeholder="Riot id # tag"
			/>
			<p class="text-red-500 text-xs italic">For example: Hide on Bush #420</p>
		</div>
		<button
			class="bg-white w-full hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow"
			type="button"
			on:click={fetchMatchApi}
		>
			Fetch match details
		</button>
	</form>

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
