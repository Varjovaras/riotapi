import type { GameData, SinglePing, PlayerData } from './types';

//total number of times a single ping has been made in the game
//this counts both teams together
export function getTotalPingsForType(gameData: GameData, pingType: SinglePing): number {
	return gameData
		.map((participant) => participant[pingType])
		.reduce((total, pings) => total + pings, 0);
}

//total number one player has made a single ping
export function getPlayerPingsForType(playerData: PlayerData, pingType: SinglePing): number {
	return playerData[pingType];
}

export function getTotalPingsInGame(playerStats: GameData): number {
	const allPings: SinglePing[] = [
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
		(total, pingType) => total + getTotalPingsForType(playerStats, pingType),
		0
	);
}

export function getPlayerWithMostPingsOfType(gameData: GameData, ping: string): string {
	const pingType = getPingTypeFromDisplayName(ping);
	if (!pingType) {
		return '';
	}
	let most = getPlayerPingsForType(gameData[0], ping as SinglePing);
	let playerWithMostPings = gameData[0].puuid;
	for (let i = 1; i < gameData.length; i++) {
		if (getPlayerPingsForType(gameData[i], ping as SinglePing) > most) {
			most = getPlayerPingsForType(gameData[i], ping as SinglePing);
			playerWithMostPings = gameData[i].puuid;
		}
	}
	return playerWithMostPings;
}

export function getPingDisplayName(ping: SinglePing): string {
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

export function getPingTypeFromDisplayName(displayName: string): SinglePing | null {
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

export function getShortPingDisplayName(ping: SinglePing): string {
	const basePingName = getPingDisplayName(ping);
	return basePingName.replace(' pings', '').toLowerCase();
}
