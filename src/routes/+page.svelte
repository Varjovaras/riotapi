<script lang="ts">
	import { PUBLIC_API_KEY, PUBLIC_NAME, PUBLIC_TAG } from '$env/static/public';
	import { z } from 'zod';
	import { GameDataSchema, type GameData } from '../schemas/gameDataSchema';

	type ParticipantIds = String[];

	let name = '';
	let apiKey = '';
	let tag = '';

	let accountApi = `https://europe.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${PUBLIC_NAME}/${PUBLIC_TAG}?api_key=${PUBLIC_API_KEY}`;
	let matchv5Api = `https://europe.api.riotgames.com/lol/match/v5/matches/EUW1_6727822954?api_key=${PUBLIC_API_KEY}`;

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

<!-- <h1>{puuid}</h1> -->
<div class="flex flex-col items-center justify-center min-h-screen py-2">
	<button
		class="flex items-center text-indigo-400 no-underline hover:no-underline font-bold text-2xl lg:text-4xl"
		on:click={fetchMatchApi}>Fetch Matchv5 API</button
	>
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
