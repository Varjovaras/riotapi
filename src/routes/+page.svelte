<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;
	// let participants = data.participants;

	$: puuid = data.post.puuid;
</script>

<h1>{puuid}</h1>
<button
	on:click={() => {
		console.log('test');
	}}>Fetch Matchv5 API</button
>

<div>{@html puuid}</div>
