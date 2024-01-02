<script lang="ts">
	import { z } from 'zod';
	import type { GameData, NumberOfPings, ParticipantIdArray, Pings } from '../types/types';
	import { gameDataSchema } from '../schemas/gameDataSchema';
	import { participantIdArraySchema } from '../schemas/participantIdArraySchema';

	const ACCOUNT_API = '/api/account';
	const MATCH_API = `/api/match/`;
	const MATCHES_BY_PUUID_API = `/api/matches-by-puuid/`;

	let riotIdName = '';
	let riotIdTag = '';
	let puuid = '';
	let matchId = '';
	let latestMatches: string[] = [];

	let gameData: GameData = [];
	let playerIds: ParticipantIdArray = [];

	function calculateTotalPings(playerStats: GameData, pingType: Pings): number {
		return playerStats
			.map((participant) => participant[pingType])
			.reduce((total, pings) => total + pings, 0);
	}

	$: pings = {
		allInPings: calculateTotalPings(gameData, 'allInPings'),
		assistMePings: calculateTotalPings(gameData, 'assistMePings'),
		baitPings: calculateTotalPings(gameData, 'baitPings'),
		basicPings: calculateTotalPings(gameData, 'basicPings'),
		commandPings: calculateTotalPings(gameData, 'commandPings'),
		dangerPings: calculateTotalPings(gameData, 'dangerPings'),
		enemyMissingPings: calculateTotalPings(gameData, 'enemyMissingPings'),
		enemyVisionPings: calculateTotalPings(gameData, 'enemyVisionPings'),
		getBackPings: calculateTotalPings(gameData, 'getBackPings'),
		holdPings: calculateTotalPings(gameData, 'holdPings'),
		needVisionPings: calculateTotalPings(gameData, 'needVisionPings'),
		onMyWayPings: calculateTotalPings(gameData, 'onMyWayPings'),
		pushPings: calculateTotalPings(gameData, 'pushPings'),
		visionClearedPings: calculateTotalPings(gameData, 'visionClearedPings')
	} satisfies NumberOfPings;

	async function fetchAccountApi() {
		const response = await fetch(`${ACCOUNT_API}?name=${riotIdName}&tag=${riotIdTag}`);
		const data = await response.json();
		const puuidFromServer = z.string().parse(data);
		puuid = puuidFromServer;
		await fetchListOfMatchIds();
	}

	async function fetchListOfMatchIds() {
		const response = await fetch(`${MATCHES_BY_PUUID_API}?puuid=${puuid}`);
		const data = await response.json();
		const matches = z.array(z.string()).parse(data);
		latestMatches = matches;
		matchId = matches[0];
	}

	async function fetchMatchApi() {
		const response = await fetch(`${MATCH_API}?match=${matchId}`);
		const data = await response.json();
		const gameDataFromServer = gameDataSchema.parse(data.gameData);
		const playerIdsFromServer = participantIdArraySchema.parse(data.participantIds);
		gameData = gameDataFromServer;
		playerIds = playerIdsFromServer;
	}
</script>

<div class="flex min-h-screen flex-col items-center justify-center">
	<form class="mb-4 rounded px-8 pb-2 pt-6 shadow-md">
		<div class="mb-4">
			<label class="mb-2 block text-sm font-bold text-gray-700" for="Summoner name">
				Riot account name
			</label>
			<input
				class="focus:shadow-outline w-full appearance-none rounded border px-3 py-2 leading-tight text-gray-700 shadow focus:outline-none"
				id="username"
				type="text"
				placeholder="Account name"
				bind:value={riotIdName}
			/>
		</div>
		<div class="mb-6">
			<label class="mb-2 block text-sm font-bold text-gray-700" for="tag"> Tag </label>
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
			class="w-full rounded border border-gray-400 bg-white px-4 py-2 font-semibold text-gray-800 shadow hover:bg-gray-300"
			type="button"
			on:click={fetchAccountApi}
		>
			Fetch account details
		</button>
	</form>

	{#if gameData.length > 0}
		<div class="pb-4">
			<h1>Total amount of pings in the game:</h1>
			{#each Object.entries(pings) as [pingKey, pingValue]}
				<div>
					<p>{pingKey}: {pingValue}</p>
				</div>
			{/each}
		</div>
	{/if}

	{#if latestMatches}
		<div class="grid grid-cols-3 gap-4">
			{#each latestMatches as match}
				<button
					class="border-spacing-2 rounded border border-gray-400 bg-white px-4 py-2 font-semibold text-gray-800 shadow hover:bg-gray-300"
					onclick={() => {
						matchId = match;
						fetchMatchApi();
					}}
				>
					{match}
				</button>
			{/each}
		</div>
	{/if}
</div>
