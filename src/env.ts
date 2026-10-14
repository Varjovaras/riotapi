import { defineEnvVars } from '@sveltejs/kit/env';

export const variables = defineEnvVars({ PRIVATE_API_KEY: { static: true } });
