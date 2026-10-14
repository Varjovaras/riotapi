<script lang="ts">
    import PingComponent from '#lib/components/PingComponent.svelte';
    import type { PageProps } from './$types';

    let { data }: PageProps = $props();
</script>

<PingComponent gameData={data.gameData} />
