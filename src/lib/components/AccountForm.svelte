<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { z } from 'zod';

	const ACCOUNT_API = '/api/account';

	let riotNameInput: HTMLInputElement | null = $state(null);
	let riotIdName = $state('');
	let riotIdTag = $state('');
	let errorMessage = $state('');

	function showError(message: string) {
		console.log('[AccountForm] showing error', message);
		errorMessage = message;
		setTimeout(() => {
			errorMessage = '';
		}, 5000);
	}

	function handleAccountError(response: Response) {
		console.log('[AccountForm] account request failed', {
			status: response.status,
			statusText: response.statusText
		});
		if (response.status === 404) {
			showError(`Account not found for ${riotIdName}#${riotIdTag}`);
		} else {
			showError(response.statusText);
		}
		riotIdName = '';
		riotIdTag = '';
		riotNameInput?.focus();
	}

	function handleSubmit(event: SubmitEvent) {
		event.preventDefault();
		console.log('[AccountForm] form submitted', { name: riotIdName, tag: riotIdTag });
		fetchAccountApi();
	}

	async function fetchAccountApi() {
		if (riotIdTag.startsWith('#')) {
			console.log('[AccountForm] stripping leading # from tag');
			riotIdTag = riotIdTag.slice(1);
		}
		const accountUrl = `${ACCOUNT_API}?${new URLSearchParams({ name: riotIdName, tag: riotIdTag })}`;
		console.log('[AccountForm] fetching account', { url: accountUrl });
		const response = await fetch(accountUrl);
		console.log('[AccountForm] account response', { status: response.status });
		if (response.status !== 200) {
			handleAccountError(response);
			return;
		}
		const data = await response.json();
		console.log('[AccountForm] account response body', data);
		const puuid = z.string().parse(data);
		console.log('[AccountForm] account found, navigating to matches', { puuid });
		await goto(resolve(`/matches?${new URLSearchParams({ puuid })}`));
	}
</script>

{#if errorMessage}
	<div class="mb-4 card preset-tonal-error p-4 text-sm" role="alert">
		<span class="font-medium">{errorMessage}</span>
	</div>
{/if}

<form class="mb-4 w-full max-w-md card bg-surface-100-900 p-6 shadow-md" onsubmit={handleSubmit}>
	<label class="label mb-4">
		<span class="label-text">Riot account name</span>
		<input
			class="input"
			type="text"
			placeholder="Account name"
			bind:value={riotIdName}
			bind:this={riotNameInput}
		/>
	</label>
	<label class="label mb-6">
		<span class="label-text">Tag</span>
		<input class="input" type="text" placeholder="Riot id # tag" bind:value={riotIdTag} />
		<span class="text-xs text-surface-700-300">For example: thebausffs #EUW</span>
	</label>
	<button class="btn w-full preset-filled-primary-500" type="submit">
		Fetch account details
	</button>
</form>
