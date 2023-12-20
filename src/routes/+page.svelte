<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;
	$: puuid = data.post.puuid;
</script>

<h1>{puuid}</h1>
<div>{@html puuid}</div>
