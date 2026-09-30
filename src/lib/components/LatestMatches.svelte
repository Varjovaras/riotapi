<script lang="ts">
	interface Props {
		latestMatches: string[];
		fetchMatchApi: (match: string) => Promise<void>;
	}

	let { latestMatches, fetchMatchApi }: Props = $props();
</script>

{#if latestMatches.length > 0}
	<h3 class="pt-8 text-center h3">List of games. Click on to fetch the match details</h3>
	<p class="text-sm text-red-500">Number 1 is the newest game</p>
	<p class="text-sm text-red-500">Games are in chronological order</p>
	<div class="grid w-80 grid-cols-3 gap-4 pt-4 pb-4">
		{#each latestMatches as match, i (match)}
			<button
				class="border-spacing-2 rounded border border-gray-400 bg-white px-4 py-2 font-semibold text-gray-800 shadow hover:bg-gray-300"
				onclick={() => fetchMatchApi(match)}
			>
				{i + 1}
			</button>
		{/each}
	</div>
{/if}
