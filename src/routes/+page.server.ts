import type { PageServerLoad } from './$types';
import { API_KEY, NAME, TAG } from '$env/static/private';
import { z } from 'zod';
import { ParticipantSchema } from '../schemas/participantSchema';

type ParticipantIds = String[];
type Participants = z.infer<typeof ParticipantSchema>;

let accountApi = `https://europe.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${NAME}/${TAG}?api_key=${API_KEY}`;
let matchv5Api = `https://europe.api.riotgames.com/lol/match/v5/matches/EUW1_6727822954?api_key=${API_KEY}`;

export const load: PageServerLoad = async ({ fetch }) => {
	const response = await fetch(accountApi);
	const data = await response.json();
	const matchData = fetchMatchApi();

	return {
		post: data,
		matchData: matchData
	};
};

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

// Write data to data.json file
// fs.writeFile('data.json', JSON.stringify(data), (err) => {
// 	if (err) {
// 		console.error('Error writing to data.json:', err);
// 	} else {
// 		console.log('Data written to data.json');
// 	}
// });
