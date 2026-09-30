<script lang="ts">
	import type { GameData } from '$lib/utils/types';
	import { gameDataSchema } from '$lib/schemas/gameDataSchema';
	import AccountForm from '$lib/components/AccountForm.svelte';
	import LatestMatches from '$lib/components/LatestMatches.svelte';
	import PingComponent from '$lib/components/PingComponent.svelte';

	const MATCH_API = '/api/match';

	let latestMatches = $state<string[]>([]);
	let gameData = $state<GameData>([]);

	function handleAccountForm(message: { puuid: string; latestMatches: string[] }) {
		console.log('[page] account message received', message);
		latestMatches = message.latestMatches;
	}

	async function fetchMatchApi(match: string) {
		const matchUrl = `${MATCH_API}?${new URLSearchParams({ match })}`;
		console.log('[page] fetching match', { url: matchUrl });
		const response = await fetch(matchUrl);
		console.log('[page] match response', { status: response.status });
		const data = await response.json();
		console.log('[page] match response body', data);
		gameData = gameDataSchema.parse(data.gameData);
		console.log('[page] parsed game data', {
			participants: gameData.length,
			players: gameData.map((player) => player.riotIdGameName)
		});
	}
</script>

<h1 class="text-center h1"><span class="text-primary-500">Ping</span> calculator</h1>
<AccountForm onmessage={handleAccountForm} />
<PingComponent {gameData} />
<LatestMatches {latestMatches} {fetchMatchApi} />
