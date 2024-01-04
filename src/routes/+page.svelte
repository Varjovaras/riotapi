<script lang="ts">
	import type { GameData } from '../lib/types';
	import { gameDataSchema } from '../lib/schemas/gameDataSchema';
	import AccountForm from '$lib/AccountForm.svelte';
	import LatestMatches from '$lib/LatestMatches.svelte';
	import PingComponent from '$lib/PingComponent.svelte';

	const MATCH_API = `/api/match/`;

	let puuid = '';
	let matchId = '';
	let latestMatches: string[] = [];
	let gameData: GameData = [];
	// $: {
	// 	console.log(latestMatches);
	// }

	async function fetchMatchApi(match: string) {
		const response = await fetch(`${MATCH_API}?match=${match}`);
		const data = await response.json();
		console.log(data);
		const gameDataFromServer = gameDataSchema.parse(data.gameData);
		gameData = gameDataFromServer;
		matchId = match;
	}

	function handleAccountForm(event: CustomEvent<{ puuid: string; latestMatches: string[] }>) {
		puuid = event.detail.puuid;
		latestMatches = event.detail.latestMatches;
	}
</script>

<h1 class="h1">Ping calculator</h1>
<AccountForm on:message={handleAccountForm} />
<PingComponent {gameData} />
<LatestMatches {latestMatches} {fetchMatchApi} />
