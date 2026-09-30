<script lang="ts">
	import {
		getTotalPingsInGame,
		getPingDisplayName,
		getShortPingDisplayName,
		getTotalPingsForType
	} from '$lib/utils/pingHelpers';
	import type { GameData, NumberOfPings, PlayerPingData, SinglePing } from '$lib/utils/types';

	let { gameData }: { gameData: GameData } = $props();

	let pingType = $state<SinglePing>('enemyMissingPings');

	const pingsByPlayer = $derived(getPingsByPlayer(pingType, gameData));
	const pingDisplayName = $derived(getPingDisplayName(pingType));
	const totalPings = $derived(getTotalPingsInGame(gameData));
	const pings = $derived({
		allInPings: getTotalPingsForType(gameData, 'allInPings'),
		assistMePings: getTotalPingsForType(gameData, 'assistMePings'),
		baitPings: getTotalPingsForType(gameData, 'baitPings'),
		basicPings: getTotalPingsForType(gameData, 'basicPings'),
		dangerPings: getTotalPingsForType(gameData, 'dangerPings'),
		enemyMissingPings: getTotalPingsForType(gameData, 'enemyMissingPings'),
		enemyVisionPings: getTotalPingsForType(gameData, 'enemyVisionPings'),
		getBackPings: getTotalPingsForType(gameData, 'getBackPings'),
		holdPings: getTotalPingsForType(gameData, 'holdPings'),
		needVisionPings: getTotalPingsForType(gameData, 'needVisionPings'),
		onMyWayPings: getTotalPingsForType(gameData, 'onMyWayPings'),
		pushPings: getTotalPingsForType(gameData, 'pushPings'),
		visionClearedPings: getTotalPingsForType(gameData, 'visionClearedPings')
	} satisfies NumberOfPings);

	function getPingsByPlayer(pingType: SinglePing, gameData: GameData): PlayerPingData[] {
		return gameData.slice(0, 10).map((player) => ({
			name: player.riotIdGameName,
			teamId: player.teamId,
			amountOfPings: player[pingType]
		}));
	}
</script>

{#if gameData.length > 0}
	<div class="w-3/4 pt-4 text-center">
		{#if pingsByPlayer.length > 0}
			<h3 class="font-sm text-error-500">Total {pingDisplayName} pings per player</h3>

			<table class="w-full">
				<tbody>
					<tr>
						<td>
							<ul class="grid grid-rows-2">
								<h3 class="h3">Blue team</h3>
								{#each pingsByPlayer as ping (ping.name)}
									{#if ping.teamId === 100}
										<li>{ping.name} {ping.amountOfPings}</li>
									{/if}
								{/each}
							</ul>
						</td>
						<td>
							<ul class="grid grid-rows-2">
								<h3 class="h3">Red team</h3>
								{#each pingsByPlayer as ping (ping.name)}
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

		<h2 class="mt-4 h2 text-error-500 shadow hover:bg-surface-900">
			Total amount of pings in the game {totalPings}
		</h2>
		<div class="grid grid-cols-2 gap-2">
			{#each Object.entries(pings) as [pingKey, pingValue] (pingKey)}
				<button
					class="my-2 border-spacing-2 rounded border border-surface-400 bg-surface-50 px-4 py-2 font-semibold text-surface-800 shadow hover:bg-surface-300"
					onclick={() => (pingType = pingKey as SinglePing)}
					style="min-width: auto;"
				>
					<p class="font-sm">{getShortPingDisplayName(pingKey as SinglePing)}:</p>
					<p class="font-sm">{pingValue}</p>
				</button>
			{/each}
		</div>
	</div>
{/if}
