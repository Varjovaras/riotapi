<script lang="ts">
	import {
		sumOfAllPingsInGame,
		getPingDisplayName,
		getPingKey,
		totalNumberOfPing,
		getPlayerWithMostPings
	} from './pingUtils';
	import type { GameData, NumberOfPings, Pings, TotalAmountOfSinglePing } from './types';

	export let gameData: GameData;
	let pingsByPlayer: TotalAmountOfSinglePing = [];
	let singlePingType: string = '';

	$: pings = {
		allInPings: totalNumberOfPing(gameData, 'allInPings'),
		assistMePings: totalNumberOfPing(gameData, 'assistMePings'),
		baitPings: totalNumberOfPing(gameData, 'baitPings'),
		basicPings: totalNumberOfPing(gameData, 'basicPings'),
		dangerPings: totalNumberOfPing(gameData, 'dangerPings'),
		enemyMissingPings: totalNumberOfPing(gameData, 'enemyMissingPings'),
		enemyVisionPings: totalNumberOfPing(gameData, 'enemyVisionPings'),
		getBackPings: totalNumberOfPing(gameData, 'getBackPings'),
		holdPings: totalNumberOfPing(gameData, 'holdPings'),
		needVisionPings: totalNumberOfPing(gameData, 'needVisionPings'),
		onMyWayPings: totalNumberOfPing(gameData, 'onMyWayPings'),
		pushPings: totalNumberOfPing(gameData, 'pushPings'),
		visionClearedPings: totalNumberOfPing(gameData, 'visionClearedPings')
	} satisfies NumberOfPings;
	$: totalPings = sumOfAllPingsInGame(gameData);
	$: puuIdWithMostPings = getPlayerWithMostPings(gameData, singlePingType);

	function getPingsByPlayer(pingType: Pings): TotalAmountOfSinglePing {
		const pingsByPlayer: TotalAmountOfSinglePing = [];
		for (let i = 0; i < 10; i++) {
			const pings = gameData[i][pingType];
			pingsByPlayer[i] = {
				name: gameData[i].riotIdGameName,
				teamId: gameData[i].teamId,
				amountOfPings: pings
			};
		}
		singlePingType = getPingDisplayName(pingType);
		return pingsByPlayer;
	}
</script>

{#if gameData.length > 0}
	<div class="w-3/4 pt-4 text-center">
		{#if pingsByPlayer.length > 0}
			<h3 class="font-sm italic text-red-500">Total {singlePingType} pings per player</h3>

			<table class="w-full">
				<tbody>
					<tr>
						<td>
							<ul class="grid grid-rows-2">
								<h3 class="h3">Blue team</h3>
								{#each pingsByPlayer as ping}
									{#if ping.teamId === 100}
										<li>{ping.name} {ping.amountOfPings}</li>
									{/if}
								{/each}
							</ul>
						</td>
						<td>
							<ul class="grid grid-rows-2">
								<h3 class="h3">Red team</h3>
								{#each pingsByPlayer as ping}
									{#if ping.teamId === 200}
										<li>{ping.name} {ping.amountOfPings}</li>
									{/if}
								{/each}
							</ul>
						</td>
					</tr>
				</tbody>
			</table>
		{/if}

		<h2 class="h2 mt-4 text-red-500 shadow hover:bg-gray-900">
			Total amount of pings in the game {totalPings}
		</h2>
		<div class="grid grid-cols-2 gap-2">
			{#each Object.entries(pings) as [pingKey, pingValue]}
				<button
					class="my-2 border-spacing-2 rounded border border-gray-400 bg-white px-4 py-2 font-semibold text-gray-800 shadow hover:bg-gray-300"
					on:click={() => {
						pingsByPlayer = getPingsByPlayer(pingKey as Pings);
					}}
					style="min-width: auto;"
				>
					<p class="font-sm">{getPingKey(pingKey as Pings)}:</p>
					<p class="font-sm">{pingValue}</p>
				</button>
			{/each}
		</div>
	</div>
{/if}
