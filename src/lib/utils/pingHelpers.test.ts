import { describe, expect, it } from 'vitest';
import exampleData from '../../../exampleData.json';
import { gameDataSchema } from '$lib/schemas/gameDataSchema';
import { participantIdArraySchema } from '$lib/schemas/participantIdArraySchema';
import {
	getPingDisplayName,
	getShortPingDisplayName,
	getTotalPingsForType,
	getTotalPingsInGame
} from '$lib/utils/pingHelpers';
import type { SinglePing } from '$lib/utils/types';

const gameData = gameDataSchema.parse(exampleData.info.participants);

const PING_TYPES: SinglePing[] = [
	'allInPings',
	'assistMePings',
	'baitPings',
	'basicPings',
	'dangerPings',
	'enemyMissingPings',
	'enemyVisionPings',
	'getBackPings',
	'holdPings',
	'needVisionPings',
	'onMyWayPings',
	'pushPings',
	'visionClearedPings'
];

describe('schemas', () => {
	it('parses the participants of the example match', () => {
		expect(gameData).toHaveLength(10);
	});

	it('parses the participant ids of the example match', () => {
		expect(participantIdArraySchema.parse(exampleData.metadata.participants)).toHaveLength(10);
	});
});

describe('ping helpers', () => {
	it('counts a single ping type across both teams', () => {
		const expected = gameData.reduce((total, player) => total + player.enemyMissingPings, 0);
		expect(getTotalPingsForType(gameData, 'enemyMissingPings')).toBe(expected);
	});

	it('counts all ping types in the game', () => {
		const expected = PING_TYPES.reduce(
			(total, pingType) => total + getTotalPingsForType(gameData, pingType),
			0
		);
		expect(getTotalPingsInGame(gameData)).toBe(expected);
	});

	it('returns zero when there is no game data', () => {
		expect(getTotalPingsInGame([])).toBe(0);
	});

	it('maps ping types to display names', () => {
		expect(getPingDisplayName('enemyMissingPings')).toBe('Enemy missing pings');
		expect(getShortPingDisplayName('enemyMissingPings')).toBe('enemy missing');
	});
});
