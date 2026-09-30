<script lang="ts">
	import { resolve } from '$app/paths';
	import LatestMatches from '$lib/components/LatestMatches.svelte';
	import PingComponent from '$lib/components/PingComponent.svelte';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
</script>

<h1 class="py-16 text-center h1"><span class="text-primary-500">Ping</span> calculator</h1>
<a class="btn preset-filled-primary-500" href={resolve('/')}>Fetch new account details</a>
<LatestMatches puuid={data.puuid} latestMatches={data.latestMatches} selectedMatch={data.match} />
<PingComponent gameData={data.gameData} />
