<script lang="ts">
	import '../app.css';

	import type { Snippet } from 'svelte';

	let { children }: { children: Snippet } = $props();
</script>

<svelte:head>
	<title>Ping Calculator</title>
</svelte:head>

<div class="flex min-h-screen flex-col items-center justify-center">
	{@render children()}
</div>
