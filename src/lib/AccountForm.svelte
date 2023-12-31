<script lang="ts">
	import { z } from 'zod';
	import { createEventDispatcher } from 'svelte';

	const ACCOUNT_API = '/api/account';
	const MATCHES_BY_PUUID_API = `/api/matches-by-puuid/`;

	let riotNameInput: HTMLInputElement;
	let puuid = '';
	let showAccountForm = true;
	let riotIdName = '';
	let riotIdTag = '';
	let errorMessage = '';

	const dispatch = createEventDispatcher<{ message: { puuid: string; latestMatches: string[] } }>();

	function errorMessageHandler(response: Response) {
		if (response.status === 404) {
			errorMessage = `Account not found for ${riotIdName}#${riotIdTag}`;
			setTimeout(() => {
				errorMessage = '';
			}, 5000);
		} else {
			errorMessage = response.statusText;
			setTimeout(() => {
				errorMessage = '';
			}, 5000);
		}
		riotIdName = '';
		riotIdTag = '';
		riotNameInput.focus();
	}

	async function fetchAccountApi() {
		if (riotIdTag && riotIdTag.startsWith('#')) {
			riotIdTag = riotIdTag.slice(1);
		}
		const response = await fetch(`${ACCOUNT_API}?name=${riotIdName}&tag=${riotIdTag}`);
		console.log(response);
		if (response.status !== 200) {
			errorMessageHandler(response);
			return;
		}
		const data = await response.json();
		console.log(data);
		const puuidFromServer = z.string().parse(data);
		puuid = puuidFromServer;
		let latestMatches = await fetchListOfMatchIds();
		if (latestMatches.length === 0) {
			errorMessage = 'No matches found';
			console.log('No matches found for that riot id');
			setTimeout(() => {
				errorMessage = '';
			}, 5000);
			showAccountForm = true;
			return;
		}
		riotIdTag = '';
		showAccountForm = false;
		dispatch('message', {
			puuid: puuid,
			latestMatches: latestMatches
		});
	}

	async function fetchListOfMatchIds() {
		const response = await fetch(`${MATCHES_BY_PUUID_API}?puuid=${puuid}`);
		const data = await response.json();
		console.log(data);
		const matches = z.array(z.string()).parse(data);
		return matches;
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
	<form class="mb-4 rounded px-8 pb-2 pt-6 shadow-md" on:submit|preventDefault={fetchAccountApi}>
		<div class="mb-4">
			<label class="mb-2 block text-sm font-bold text-gray-700" for="Summoner name">
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
			<label class="mb-2 block text-sm font-bold text-gray-700" for="tag"> Tag </label>
			<input
				class="focus:shadow-outline mb-3 w-full appearance-none rounded border border-red-500 px-3 py-2 leading-tight text-gray-700 shadow focus:outline-none"
				id="tag"
				type="text"
				placeholder="Riot id # tag"
				bind:value={riotIdTag}
			/>
			<p class="text-xs italic text-red-500">For example: thebausffs #EUW</p>
		</div>
		<button
			class="w-full rounded border border-gray-400 bg-white px-4 py-2 text-gray-800 shadow hover:bg-gray-300"
			type="submit"
		>
			Fetch account details
		</button>
	</form>
{:else if !showAccountForm}
	<button
		class="bg-grey-100 text-gray300 mt-4 rounded border border-gray-400 px-8 py-2 font-semibold shadow hover:bg-gray-800"
		type="button"
		on:click={() => {
			showAccountForm = true;
		}}
	>
		Fetch new account details
	</button>
{/if}
