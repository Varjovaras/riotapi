import { z } from 'zod';

export const pingSchema = z.object({
	allInPings: z.number(),
	assistMePings: z.number(),
	baitPings: z.number(),
	basicPings: z.number(),
	dangerPings: z.number(),
	enemyMissingPings: z.number(),
	enemyVisionPings: z.number(),
	getBackPings: z.number(),
	holdPings: z.number(),
	needVisionPings: z.number(),
	onMyWayPings: z.number(),
	pushPings: z.number(),
	visionClearedPings: z.number()
});
