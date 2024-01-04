<script lang="ts">
	import type { GameData, NumberOfPings, Pings, TotalAmountOfSinglePing } from '../lib/types';
	import { gameDataSchema } from '../schemas/gameDataSchema';
	import { calculateSinglePingType, calculateTotalPings, getPingKey } from '../lib/pingUtils';
	import AccountForm from '$lib/AccountForm.svelte';

	const MATCH_API = `/api/match/`;

	let puuid = '';
	let matchId = '';
	let pingsByPlayer: TotalAmountOfSinglePing = [];
	let latestMatches: string[] = [];
	let gameData: GameData = [];

	$: pings = {
		allInPings: calculateSinglePingType(gameData, 'allInPings'),
		assistMePings: calculateSinglePingType(gameData, 'assistMePings'),
		baitPings: calculateSinglePingType(gameData, 'baitPings'),
		basicPings: calculateSinglePingType(gameData, 'basicPings'),
		dangerPings: calculateSinglePingType(gameData, 'dangerPings'),
		enemyMissingPings: calculateSinglePingType(gameData, 'enemyMissingPings'),
		enemyVisionPings: calculateSinglePingType(gameData, 'enemyVisionPings'),
		getBackPings: calculateSinglePingType(gameData, 'getBackPings'),
		holdPings: calculateSinglePingType(gameData, 'holdPings'),
		needVisionPings: calculateSinglePingType(gameData, 'needVisionPings'),
		onMyWayPings: calculateSinglePingType(gameData, 'onMyWayPings'),
		pushPings: calculateSinglePingType(gameData, 'pushPings'),
		visionClearedPings: calculateSinglePingType(gameData, 'visionClearedPings')
	} satisfies NumberOfPings;
	$: totalPings = calculateTotalPings(gameData);

	async function fetchMatchApi() {
		const response = await fetch(`${MATCH_API}?match=${matchId}`);
		const data = await response.json();
		console.log(data);
		const gameDataFromServer = gameDataSchema.parse(data.gameData);
		gameData = gameDataFromServer;
	}

	function getPingsByPlayer(pingType: Pings): TotalAmountOfSinglePing {
		const pingsByPlayer: TotalAmountOfSinglePing = [];
		for (let i = 0; i < 10; i++) {
			const pings = gameData[i][pingType];
			pingsByPlayer[i] = {
				name: gameData[i].riotIdGameName,
				amountOfPings: pings
			};
		}
		return pingsByPlayer;
	}

	function handleAccountForm(event: CustomEvent<{ puuid: string; latestMatches: string[] }>) {
		puuid = event.detail.puuid;
		latestMatches = event.detail.latestMatches;
	}
</script>

<div class="flex min-h-screen flex-col items-center justify-center">
	<h1 class="h1">Ping calculator</h1>
	<AccountForm on:submit={handleAccountForm} />

	{#if gameData.length > 0}
		<div class="w-3/4 pt-4">
			{#if pingsByPlayer.length > 0}
				<div
					class="h-24 border-spacing-2 rounded border border-gray-400 bg-white px-8 py-4 font-semibold text-gray-800 shadow hover:bg-gray-300"
				>
					List of pings by a player
				</div>
				<ul class="grid grid-rows-2">
					{#each pingsByPlayer as ping}
						<li>{ping.name} {ping.amountOfPings}</li>
					{/each}
				</ul>
			{/if}
			<h2
				class="h-2 rounded border border-gray-400 bg-white font-semibold text-gray-800 shadow hover:bg-gray-300"
			>
				Total amount of pings in the game
			</h2>
			<h2 class="h2 text-center font-semibold">{totalPings}</h2>
			<div class="mb-4 mt-4 grid w-full grid-cols-2 gap-4">
				{#each Object.entries(pings) as [pingKey, pingValue]}
					<button
						class="h-24 border-spacing-2 rounded border border-gray-400 bg-white px-8 py-4 font-semibold text-gray-800 shadow hover:bg-gray-300"
						on:click={() => {
							pingsByPlayer = getPingsByPlayer(pingKey as Pings);
						}}
					>
						<p class="font-semibold">{getPingKey(pingKey)}:</p>
						<p class="font-semibold">{pingValue}</p>
					</button>
				{/each}
			</div>
		</div>
	{/if}

	{#if latestMatches.length > 0}
		<h3 class="h3 pt-8 text-center">List of games. Click on to fetch the match details</h3>
		<div class="grid w-80 grid-cols-3 gap-4 pb-4 pt-4">
			{#each latestMatches as match, i}
				<button
					class="border-spacing-2 rounded border border-gray-400 bg-white px-4 py-2 font-semibold text-gray-800 shadow hover:bg-gray-300"
					onclick={() => {
						matchId = match;
						fetchMatchApi();
					}}
				>
					{i + 1}
				</button>
			{/each}
		</div>
	{/if}
</div>
