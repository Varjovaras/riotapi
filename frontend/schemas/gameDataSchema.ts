import type { z } from 'zod';
import { PlayerDataSchema } from './playerDataSchema';

export const GameDataSchema = PlayerDataSchema.array();
