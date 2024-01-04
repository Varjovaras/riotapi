import type { z } from 'zod';
import type { playerDataSchema } from './schemas/playerDataSchema';
import type { gameDataSchema } from './schemas/gameDataSchema';
import type { participantIdArraySchema } from './schemas/participantIdArraySchema';
import type { pingSchema } from './schemas/pingSchema';

export type Pings = keyof z.infer<typeof pingSchema>;
export type NumberOfPings = {
	[K in Pings]: number;
};

export type PingKeys = [keyof NumberOfPings];
export type TotalNumberOfPings = NumberOfPings & {
	totalPings: number;
};

export type RiotAccountNameAndAmountOfSinglePing = {
	name: string;
	amountOfPings: number;
};
export type TotalAmountOfSinglePing = RiotAccountNameAndAmountOfSinglePing[];

export type ParticipantIdArray = z.infer<typeof participantIdArraySchema>;
export type PlayerData = z.infer<typeof playerDataSchema>;
export type GameData = z.infer<typeof gameDataSchema>;
