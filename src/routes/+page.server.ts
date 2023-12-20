import type { PageServerLoad } from './$types';
import { API_KEY, NAME, TAG } from '$env/static/private';

export const load: PageServerLoad = async ({ params, fetch }) => {
	const response = await fetch(
		`https://europe.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${NAME}/${TAG}?api_key=${API_KEY}`
	);
	const data = await response.json();
	console.log(data);

	return {
		post: data
	};
};
