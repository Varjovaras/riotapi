import type { z } from 'zod';
import type { PlayerDataSchema } from '../schemas/playerDataSchema';
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

export type PlayerData = z.infer<typeof PlayerDataSchema>;
export type GameData = z.infer<typeof gameDataSchema>;
