import type { PageServerLoad } from './$types';
import { API_KEY } from '$env/static/private';

export const load: PageServerLoad = async ({ params }) => {
	//https://euw1.api.riotgames.com/lol/summoner/v4/summoners/me

	return {
		// post: await db.getPost(params.slug)
	};
};
