import type { GameData, Pings, PlayerData } from './types';

//total number of times a single ping has been made in the game
//this counts both teams together
export function totalNumberOfSinglePing(gameData: GameData, pingType: Pings): number {
	return gameData
		.map((participant) => participant[pingType])
		.reduce((total, pings) => total + pings, 0);
}

//total number one player has made a single ping
export function totalNumberOfSinglePingPerPlayer(playerData: PlayerData, pingType: Pings): number {
	return playerData[pingType];
}

export function sumOfAllPingsInGame(playerStats: GameData): number {
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
		(total, pingType) => total + totalNumberOfSinglePing(playerStats, pingType),
		0
	);
}

export function getPlayerWithMostPings(gameData: GameData, ping: string): string {
	const pingType = getPingTypeFromString(ping);
	if (!pingType) {
		return '';
	}
	let most = totalNumberOfSinglePingPerPlayer(gameData[0], ping as Pings);
	let playerWithMostPings = gameData[0].puuid;
	for (let i = 1; i < gameData.length; i++) {
		if (totalNumberOfSinglePingPerPlayer(gameData[i], ping as Pings) > most) {
			most = totalNumberOfSinglePingPerPlayer(gameData[i], ping as Pings);
			playerWithMostPings = gameData[i].puuid;
		}
	}
	return playerWithMostPings;
}

export function getPingKey(ping: Pings): string {
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
export function getPingTypeFromString(displayName: string): Pings | null {
	switch (displayName.toLowerCase()) {
		case 'all in':
			return 'allInPings';
		case 'assist me':
			return 'assistMePings';
		case 'bait':
			return 'baitPings';
		case 'basic':
			return 'basicPings';
		// case 'command':
		// 	return 'commandPings';
		case 'danger':
			return 'dangerPings';
		case 'enemy missing':
			return 'enemyMissingPings';
		case 'enemy vision':
			return 'enemyVisionPings';
		case 'get back':
			return 'getBackPings';
		case 'hold':
			return 'holdPings';
		case 'need vision':
			return 'needVisionPings';
		case 'on my way':
			return 'onMyWayPings';
		case 'push':
			return 'pushPings';
		case 'vision cleared':
			return 'visionClearedPings';
		default:
			return null;
	}
}

export function getPingDisplayName(ping: Pings): string {
	const basePingName = getPingKey(ping);
	return basePingName.replace(' pings', '').toLowerCase();
}
