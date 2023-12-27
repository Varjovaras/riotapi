import { z } from 'zod';

export const participantIdArraySchema = z.string().array().length(10);
