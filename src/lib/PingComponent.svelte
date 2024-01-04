<script lang="ts">
	import { calculateSinglePingType, calculateTotalPings, getPingKey } from './pingUtils';
	import type { GameData, NumberOfPings, Pings, TotalAmountOfSinglePing } from './types';

	export let gameData: GameData;
	let pingsByPlayer: TotalAmountOfSinglePing = [];
	function getPingsByPlayer(pingType: Pings): TotalAmountOfSinglePing {
		const pingsByPlayer: TotalAmountOfSinglePing = [];
		for (let i = 0; i < 10; i++) {
			const pings = gameData[i][pingType];
			pingsByPlayer[i] = {
				name: gameData[i].riotIdGameName,
				amountOfPings: pings
			};
		}
		return pingsByPlayer;
	}
	$: pings = {
		allInPings: calculateSinglePingType(gameData, 'allInPings'),
		assistMePings: calculateSinglePingType(gameData, 'assistMePings'),
		baitPings: calculateSinglePingType(gameData, 'baitPings'),
		basicPings: calculateSinglePingType(gameData, 'basicPings'),
		dangerPings: calculateSinglePingType(gameData, 'dangerPings'),
		enemyMissingPings: calculateSinglePingType(gameData, 'enemyMissingPings'),
		enemyVisionPings: calculateSinglePingType(gameData, 'enemyVisionPings'),
		getBackPings: calculateSinglePingType(gameData, 'getBackPings'),
		holdPings: calculateSinglePingType(gameData, 'holdPings'),
		needVisionPings: calculateSinglePingType(gameData, 'needVisionPings'),
		onMyWayPings: calculateSinglePingType(gameData, 'onMyWayPings'),
		pushPings: calculateSinglePingType(gameData, 'pushPings'),
		visionClearedPings: calculateSinglePingType(gameData, 'visionClearedPings')
	} satisfies NumberOfPings;
	$: totalPings = calculateTotalPings(gameData);
</script>

{#if gameData.length > 0}
	<div class="w-3/4 pt-4">
		{#if pingsByPlayer.length > 0}
			<div
				class="h-24 border-spacing-2 rounded border border-gray-400 bg-white px-8 py-4 font-semibold text-gray-800 shadow hover:bg-gray-300"
			>
				List of pings by a player
			</div>
			<ul class="grid grid-rows-2">
				{#each pingsByPlayer as ping}
					<li>{ping.name} {ping.amountOfPings}</li>
				{/each}
			</ul>
		{/if}
		<h2
			class="h-2 rounded border border-gray-400 bg-white font-semibold text-gray-800 shadow hover:bg-gray-300"
		>
			Total amount of pings in the game
		</h2>
		<h2 class="h2 text-center font-semibold">{totalPings}</h2>
		<div class="mb-4 mt-4 grid w-full grid-cols-2 gap-4">
			{#each Object.entries(pings) as [pingKey, pingValue]}
				<button
					class="h-24 border-spacing-2 rounded border border-gray-400 bg-white px-8 py-4 font-semibold text-gray-800 shadow hover:bg-gray-300"
					on:click={() => {
                    pingsByPlayer = getPingsByPlayer(pingKey as Pings);
                }}
				>
					<p class="font-semibold">{getPingKey(pingKey)}:</p>
					<p class="font-semibold">{pingValue}</p>
				</button>
			{/each}
		</div>
	</div>
{/if}
