<script lang="ts">
	import { API_KEY, NAME, TAG } from '$env/static/private';
	import { z } from 'zod';
	import { ParticipantSchema } from '../schemas/participantSchema';

	type ParticipantIds = String[];
	type Participants = z.infer<typeof ParticipantSchema>;

	let accountApi = `https://europe.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${NAME}/${TAG}?api_key=${API_KEY}`;
	let matchv5Api = `https://europe.api.riotgames.com/lol/match/v5/matches/EUW1_6727822954?api_key=${API_KEY}`;

	async function fetchMatchApi() {
		const response = await fetch(matchv5Api);
		const data = await response.json();
		const participantIds: ParticipantIds = z.array(z.string()).parse(data.metadata.participants);

		const participants: Participants = ParticipantSchema.parse(data.info.participants);

		return {
			participantIds,
			participants
		};
	}
</script>

<!-- <h1>{puuid}</h1> -->
<button on:click={() => {}}>Fetch Matchv5 API</button>

<div>123</div>
