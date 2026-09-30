<script lang="ts">
	import type { GameData } from '$lib/utils/types';
	import { gameDataSchema } from '$lib/schemas/gameDataSchema';
	import AccountForm from '$lib/components/AccountForm.svelte';
	import LatestMatches from '$lib/components/LatestMatches.svelte';
	import PingComponent from '$lib/components/PingComponent.svelte';

	const MATCH_API = '/api/match';

	let latestMatches = $state<string[]>([]);
	let gameData = $state<GameData>([]);

	async function fetchMatchApi(match: string) {
		const response = await fetch(`${MATCH_API}?${new URLSearchParams({ match })}`);
		const data = await response.json();
		gameData = gameDataSchema.parse(data.gameData);
	}

	function handleAccountForm(message: { puuid: string; latestMatches: string[] }) {
		latestMatches = message.latestMatches;
	}
</script>

<h1 class="h1">
	<span
		class="block bg-gradient-to-r from-blue-500 via-pink-500 to-blue-500 bg-clip-text text-center text-transparent"
		>Ping</span
	> calculator
</h1>
<AccountForm onmessage={handleAccountForm} />
<PingComponent {gameData} />
<LatestMatches {latestMatches} {fetchMatchApi} />
