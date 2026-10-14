<script lang="ts">
    import { resolve } from '$app/paths';
    import { page } from '$app/state';
    import LatestMatches from '#lib/components/LatestMatches.svelte';
    import type { LayoutProps } from './$types';

    let { data, children }: LayoutProps = $props();

    // Keep the match links on whichever view we're currently on.
    const route = $derived(page.url.pathname.startsWith('/pings') ? 'pings' : 'matches');
</script>

<h1 class="py-16 text-center h1"><span class="text-primary-500">Ping</span> calculator</h1>
<a class="btn preset-filled-primary-500" href={resolve('/')}>Fetch new account details</a>
<LatestMatches
    region={data.region}
    name={data.name}
    tag={data.tag}
    latestMatches={data.latestMatches}
    selectedMatch={data.match}
    {route}
/>
{@render children()}
