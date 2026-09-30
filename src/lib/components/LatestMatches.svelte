<script lang="ts">
	import { resolve } from '$app/paths';

	interface Props {
		puuid: string;
		latestMatches: string[];
		selectedMatch?: string;
	}

	let { puuid, latestMatches, selectedMatch = '' }: Props = $props();
</script>

{#if latestMatches.length > 0}
	<h3 class="p-8 text-center h3">List of games. Click on to fetch the match details</h3>
	<p class="text-sm text-error-500">Number 1 is the newest game</p>
	<p class="text-sm text-error-500">Games are in chronological order</p>
	<div class="grid w-80 grid-cols-3 gap-4 pt-4 pb-4">
		{#each latestMatches as match, i (match)}
			<a
				class="btn {match === selectedMatch ? 'preset-filled-primary-500' : 'preset-filled'}"
				href={resolve(`/matches?${new URLSearchParams({ puuid, match })}`)}
				aria-current={match === selectedMatch ? 'true' : undefined}
			>
				{i + 1}
			</a>
		{/each}
	</div>
{:else}
	<p class="text-sm text-error-500">No matches found for this account</p>
{/if}
