import type { GameData, Pings, NumberOfPings, TotalNumberOfPings } from '../types/types';

export function calculateSinglePingType(playerStats: GameData, pingType: Pings): number {
	return playerStats
		.map((participant) => participant[pingType])
		.reduce((total, pings) => total + pings, 0);
}

export function calculateTotalPings(playerStats: GameData): number {
	const allPings: Pings[] = [
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

	return allPings.reduce(
		(total, pingType) => total + calculateSinglePingType(playerStats, pingType),
		0
	);
}
export function getPingKey(ping: string): string {
	switch (ping) {
		case 'allInPings':
			return 'All in pings';
		case 'assistMePings':
			return 'Assist me pings';
		case 'baitPings':
			return 'Bait pings';
		case 'basicPings':
			return 'Basic pings';
		// case 'commandPings':
		// 	return 'Command pings';
		case 'dangerPings':
			return 'Danger pings';
		case 'enemyMissingPings':
			return 'Enemy missing pings';
		case 'enemyVisionPings':
			return 'Enemy vision pings';
		case 'getBackPings':
			return 'Get back pings';
		case 'holdPings':
			return 'Hold pings';
		case 'needVisionPings':
			return 'Need vision pings';
		case 'onMyWayPings':
			return 'On my way pings';
		case 'pushPings':
			return 'Push pings';
		case 'visionClearedPings':
			return 'Vision cleared pings';
		default:
			return '';
	}
}
