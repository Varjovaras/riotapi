<script lang="ts">
	import { z } from 'zod';

	const ACCOUNT_API = '/api/account';
	const MATCHES_BY_PUUID_API = '/api/matches-by-puuid';

	interface AccountMessage {
		puuid: string;
		latestMatches: string[];
	}

	let { onmessage }: { onmessage?: (message: AccountMessage) => void } = $props();

	let riotNameInput: HTMLInputElement | null = $state(null);
	let puuid = $state('');
	let showAccountForm = $state(true);
	let riotIdName = $state('');
	let riotIdTag = $state('');
	let errorMessage = $state('');

	function showError(message: string) {
		errorMessage = message;
		setTimeout(() => {
			errorMessage = '';
		}, 5000);
	}

	function handleAccountError(response: Response) {
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
		fetchAccountApi();
	}

	async function fetchAccountApi() {
		if (riotIdTag.startsWith('#')) {
			riotIdTag = riotIdTag.slice(1);
		}
		const response = await fetch(
			`${ACCOUNT_API}?${new URLSearchParams({ name: riotIdName, tag: riotIdTag })}`
		);
		if (response.status !== 200) {
			handleAccountError(response);
			return;
		}
		const data = await response.json();
		puuid = z.string().parse(data);
		const latestMatches = await fetchListOfMatchIds();
		if (latestMatches.length === 0) {
			showError('No matches found');
			showAccountForm = true;
			return;
		}
		riotIdTag = '';
		showAccountForm = false;
		onmessage?.({ puuid, latestMatches });
	}

	async function fetchListOfMatchIds() {
		const response = await fetch(`${MATCHES_BY_PUUID_API}?${new URLSearchParams({ puuid })}`);
		const data = await response.json();
		return z.array(z.string()).parse(data);
	}
</script>

{#if errorMessage}
	<div
		class="my-4 mb-4 rounded-lg bg-red-50 p-4 text-sm text-red-800 dark:bg-gray-800 dark:text-red-400"
		role="alert"
	>
		<span class="font-medium">{errorMessage}</span>
	</div>
{/if}

{#if showAccountForm}
	<form class="mb-4 rounded px-8 pt-6 pb-2 shadow-md" onsubmit={handleSubmit}>
		<div class="mb-4">
			<label class="mb-2 block text-sm font-bold text-gray-700" for="username">
				Riot account name
			</label>
			<input
				class="focus:shadow-outline w-full appearance-none rounded border px-3 py-2 leading-tight text-gray-700 shadow focus:outline-none"
				id="username"
				type="text"
				placeholder="Account name"
				bind:value={riotIdName}
				bind:this={riotNameInput}
			/>
		</div>
		<div class="mb-6">
			<label class="mb-2 block text-sm font-bold text-gray-700" for="tag">Tag</label>
			<input
				class="focus:shadow-outline mb-3 w-full appearance-none rounded border border-red-500 px-3 py-2 leading-tight text-gray-700 shadow focus:outline-none"
				id="tag"
				type="text"
				placeholder="Riot id # tag"
				bind:value={riotIdTag}
			/>
			<p class="text-xs text-red-500 italic">For example: thebausffs #EUW</p>
		</div>
		<button
			class="w-full rounded border border-gray-400 bg-white px-4 py-2 text-gray-800 shadow hover:bg-gray-300"
			type="submit"
		>
			Fetch account details
		</button>
	</form>
{:else}
	<button
		class="bg-grey-100 text-gray300 mt-4 rounded border border-gray-400 px-8 py-2 font-semibold shadow hover:bg-gray-800"
		type="button"
		onclick={() => (showAccountForm = true)}
	>
		Fetch new account details
	</button>
{/if}
