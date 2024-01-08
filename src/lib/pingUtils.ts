import type { GameData, Pings, PlayerData } from './types';

//total number of times a single ping has been made in the game
//this counts both teams together
//RENAME THIS IN THE FUTURE
export function totalNumberOfPing(gameData: GameData, pingType: Pings): number {
	return gameData
		.map((participant) => participant[pingType])
		.reduce((total, pings) => total + pings, 0);
}

//total number one player has made a single ping
//RENAME THIS IN THE FUTURE
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
	return allPings.reduce((total, pingType) => total + totalNumberOfPing(playerStats, pingType), 0);
}

export function getPlayerWithMostPings(gameData: GameData, ping: Pings): string {
	let most = totalNumberOfSinglePingPerPlayer(gameData[0], ping);
	let playerWithMostPings = gameData[0].puuid;
	for (let i = 1; i < gameData.length; i++) {
		if (totalNumberOfSinglePingPerPlayer(gameData[i], ping) > most) {
			most = totalNumberOfSinglePingPerPlayer(gameData[i], ping);
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

export function getPingDisplayName(ping: Pings): string {
	const basePingName = getPingKey(ping);
	return basePingName.replace(' pings', '').toLowerCase();
}
