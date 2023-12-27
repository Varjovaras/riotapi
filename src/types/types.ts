import type { z } from 'zod';
import type { playerDataSchema } from '../schemas/playerDataSchema';
import type { gameDataSchema } from '../schemas/gameDataSchema';

export type Ping =
	| 'enemyMissingPings'
	| 'basicPings'
	| 'dangerPings'
	| 'allInPings'
	| 'getBackPings'
	| 'needVisionPings'
	| 'onMyWayPings'
	| 'assistMePings'
	| 'pushPings';

export type ParticipantIds = String[];

export type PlayerData = z.infer<typeof playerDataSchema>;
export type GameData = z.infer<typeof gameDataSchema>;
