import { loadMatchPageData } from '#lib/utils/loadMatchPageData.js';
import type { LayoutLoad } from './$types';

// One load for both /matches and /pings. It only reads search params, so
// navigating between the two keeps the data instead of re-fetching.
export const load: LayoutLoad = ({ fetch, url }) => loadMatchPageData({ fetch, url });
