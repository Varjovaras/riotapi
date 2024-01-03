<script lang="ts">
	import { z } from 'zod';
	import type { GameData, NumberOfPings, ParticipantIdArray } from '../types/types';
	import { gameDataSchema } from '../schemas/gameDataSchema';
	import { participantIdArraySchema } from '../schemas/participantIdArraySchema';
	import { calculateSinglePingType, calculateTotalPings, getPingKey } from './utils';

	const ACCOUNT_API = '/api/account';
	const MATCH_API = `/api/match/`;
	const MATCHES_BY_PUUID_API = `/api/matches-by-puuid/`;

	let riotIdName = '';
	let riotIdTag = '';
	let puuid = '';
	let matchId = '';
	let latestMatches: string[] = [];
	let errorMessage = '';
	let gameData: GameData = [];
	let playerIds: ParticipantIdArray = [];
	let showAccountForm = true;

	async function fetchAccountApi() {
		if (riotIdTag && riotIdTag.startsWith('#')) {
			riotIdTag = riotIdTag.slice(1);
		}
		const response = await fetch(`${ACCOUNT_API}?name=${riotIdName}&tag=${riotIdTag}`);
		const data = await response.json();
		console.log(data);
		const puuidFromServer = z.string().parse(data);
		puuid = puuidFromServer;
		await fetchListOfMatchIds();
		riotIdName = '';
		riotIdTag = '';
		showAccountForm = false;
	}

	async function fetchListOfMatchIds() {
		const response = await fetch(`${MATCHES_BY_PUUID_API}?puuid=${puuid}`);
		const data = await response.json();
		console.log(data);
		const matches = z.array(z.string()).parse(data);
		latestMatches = matches;
		matchId = matches[0];
	}

	async function fetchMatchApi() {
		const response = await fetch(`${MATCH_API}?match=${matchId}`);
		const data = await response.json();
		console.log(data);
		const gameDataFromServer = gameDataSchema.parse(data.gameData);
		const playerIdsFromServer = participantIdArraySchema.parse(data.participantIds);
		gameData = gameDataFromServer;
		playerIds = playerIdsFromServer;
	}
	$: pings = {
		allInPings: calculateSinglePingType(gameData, 'allInPings'),
		assistMePings: calculateSinglePingType(gameData, 'assistMePings'),
		baitPings: calculateSinglePingType(gameData, 'baitPings'),
		basicPings: calculateSinglePingType(gameData, 'basicPings'),
		commandPings: calculateSinglePingType(gameData, 'commandPings'),
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
</script>

<div class="flex min-h-screen flex-col items-center justify-center">
	<h1 class="h1">Ping calculator</h1>
	{#if errorMessage}
		<div class="alert-message">
			<h3 class="h3">(Error)</h3>
			<p>{errorMessage}</p>
		</div>
	{/if}
	{#if showAccountForm}
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
	{/if}

	{#if gameData.length > 0}
		<div class="w-80">
			<h3 class="h3">Total amount of pings in the game: {totalPings}</h3>
			<div class="grid w-full grid-cols-2 gap-4 pb-4 pt-4">
				{#each Object.entries(pings) as [pingKey, pingValue]}
					<div
						class="border-spacing-2 rounded border border-gray-400 bg-white px-4 py-2 font-semibold text-gray-800 shadow hover:bg-gray-300"
					>
						<p>{getPingKey(pingKey)}: {pingValue}</p>
					</div>
				{/each}
			</div>
		</div>
	{/if}

	{#if latestMatches}
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
