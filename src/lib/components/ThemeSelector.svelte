<script lang="ts">
	import { DEFAULT_THEME, THEMES, isTheme, type Theme } from '$lib/utils/themes';

	const STORAGE_KEY = 'theme';

	let theme = $state<Theme>(DEFAULT_THEME);
	let restored = $state(false);

	// Restore the saved theme after mount. The inline script in app.html already
	// applied it to <html> before first paint; this only syncs the selector value.
	$effect(() => {
		const saved = localStorage.getItem(STORAGE_KEY);
		if (isTheme(saved)) {
			theme = saved;
		}
		restored = true;
	});

	// Apply and persist the selected theme.
	$effect(() => {
		if (!restored) return;
		document.documentElement.dataset.theme = theme;
		localStorage.setItem(STORAGE_KEY, theme);
	});
</script>

<div class="fixed right-4 bottom-4 z-50 w-48 card bg-surface-100-900 p-3 shadow-lg">
	<label class="label">
		<span class="label-text">Skeleton theme</span>
		<select class="select capitalize" bind:value={theme}>
			{#each THEMES as name (name)}
				<option value={name}>{name}</option>
			{/each}
		</select>
	</label>
</div>
