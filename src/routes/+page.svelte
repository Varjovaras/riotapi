<script lang="ts">
	import { PUBLIC_API_KEY, PUBLIC_NAME, PUBLIC_TAG } from '$env/static/public';
	import { z } from 'zod';
	import { GameData } from '../schemas/gameData';

	type ParticipantIds = String[];
	type GameData = z.infer<typeof GameData>;

	let name = '';
	let apiKey = '';
	let tag = '';

	let accountApi = `https://europe.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${PUBLIC_NAME}/${PUBLIC_TAG}?api_key=${PUBLIC_API_KEY}`;
	let matchv5Api = `https://europe.api.riotgames.com/lol/match/v5/matches/EUW1_6727822954?api_key=${PUBLIC_API_KEY}`;

	let playerStats: GameData = [];
	let playerIds: ParticipantIds = [];
	$: missingPings = playerStats.map((participant) => participant.enemyMissingPings);
	$: totalMissingPings = playerStats
		.map((participant) => participant.enemyMissingPings)
		.reduce((total, pings) => total + pings, 0);

	async function fetchAccountApi() {
		const response = await fetch(accountApi);
		const data = await response.json();
		const participantIds: ParticipantIds = z.array(z.string()).parse(data.metadata.participants);

		const participants: GameData = GameData.parse(data.info.participants);

		return {
			participantIds,
			participants
		};
	}

	async function fetchMatchApi() {
		const response = await fetch(matchv5Api);
		const data = await response.json();
		const participantIds: ParticipantIds = z.array(z.string()).parse(data.metadata.participants);

		const participants: GameData = GameData.parse(data.info.participants);
		playerStats = participants;
		playerIds = participantIds;
	}
</script>

<!-- <h1>{puuid}</h1> -->
<button on:click={fetchMatchApi}>Fetch Matchv5 API</button>

<div>total missing pings: {totalMissingPings}</div>
