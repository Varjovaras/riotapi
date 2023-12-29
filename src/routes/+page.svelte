<script lang="ts">
	import { z } from 'zod';
	import type { GameData, ParticipantIdArray, Pings } from '../types/types';
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
	$: totalMissingPings = calculateTotalPings(gameData, 'enemyMissingPings');
	$: totalBasicPings = calculateTotalPings(gameData, 'basicPings');
	$: totalDangerPings = calculateTotalPings(gameData, 'dangerPings');
	$: totalAllInPings = calculateTotalPings(gameData, 'allInPings');
	$: totalGetBackPings = calculateTotalPings(gameData, 'getBackPings');
	$: totalNeedVisionPings = calculateTotalPings(gameData, 'needVisionPings');
	$: totalOnMyWayPings = calculateTotalPings(gameData, 'onMyWayPings');
	$: totalAssistMePings = calculateTotalPings(gameData, 'assistMePings');
	$: totalPushPings = calculateTotalPings(gameData, 'pushPings');

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
	<div class="mb-4 rounded px-8 pb-8 pt-6 shadow-md">
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
	</div>

	{#if gameData.length > 0}
		<div class="pb-4">
			<div>Basic pings: {totalBasicPings}</div>
			<div>MissingPings pings: {totalMissingPings}</div>
			<div>Danger pings: {totalDangerPings}</div>
			<div>All in pings: {totalAllInPings}</div>
			<div>Get back pings: {totalGetBackPings}</div>
			<div>Need vision pings: {totalNeedVisionPings}</div>
			<div>On my way pings: {totalOnMyWayPings}</div>
			<div>Assist me pings: {totalAssistMePings}</div>
			<div>Push pings: {totalPushPings}</div>
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
