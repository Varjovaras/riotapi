import type { z } from 'zod';
import { PlayerDataSchema } from './playerDataSchema';

export type PlayerData = z.infer<typeof PlayerDataSchema>;
export type GameData = z.infer<typeof GameDataSchema>;

export const GameDataSchema = PlayerDataSchema.array();
