<script lang="ts">
    import { goto } from '$app/navigation';
    import { resolve } from '$app/paths';
    import { z } from 'zod';

    const ACCOUNT_API = '/api/account';

    let riotNameInput: HTMLInputElement | null = $state(null);
    let riotUsername = $state('');
    let errorMessage = $state('');

    function handleSubmit(event: SubmitEvent) {
        event.preventDefault();
        console.log('[AccountForm] form submitted', { name: riotUsername });
        fetchAccountApi();
    }

    async function fetchAccountApi() {
        const [riotIdName, riotIdTag, ...rest] = riotUsername.trim().split('#');
        if (!riotIdName || !riotIdTag || rest.length > 0) {
            showError('Enter your Riot ID as name#tag');
            return;
        }
        const accountUrl = `${ACCOUNT_API}?${new URLSearchParams({ name: riotIdName, tag: riotIdTag })}`;
        console.log('[AccountForm] fetching account', { url: accountUrl });
        const response = await fetch(accountUrl);
        console.log('[AccountForm] account response', {
            status: response.status
        });
        if (response.status !== 200) {
            handleAccountError(response);
            return;
        }
        const data = await response.json();
        console.log('[AccountForm] account response body', data);
        const puuid = z.string().parse(data);
        console.log('[AccountForm] account found, navigating to matches', {
            puuid
        });
        await goto(resolve(`matches?${new URLSearchParams({ puuid })}`));
    }

    function handleAccountError(response: Response) {
        console.log('[AccountForm] account request failed', {
            status: response.status,
            statusText: response.statusText
        });
        if (response.status === 404) {
            showError(`Account not found for ${riotUsername}`);
        } else {
            showError(response.statusText);
        }

        riotNameInput?.focus();
    }

    function showError(message: string) {
        console.log('[AccountForm] showing error', message);
        errorMessage = message;
        setTimeout(() => {
            errorMessage = '';
        }, 5000);
    }
</script>

{#if errorMessage}
    <div class="mb-4 card preset-tonal-error p-4 text-sm" role="alert">
        <span class="font-medium">{errorMessage}</span>
    </div>
{/if}

<form class="mb-4 w-full max-w-md card bg-surface-100-900 p-6 shadow-md" onsubmit={handleSubmit}>
    <label class="label mb-4">
        <span class="label-text text-xs">Riot account name</span>
        <span class="text-shadow-xs– text-xs text-primary-500">For example thebausffs#EUW</span>
        <input
            class="input"
            type="text"
            placeholder="Account name"
            bind:value={riotUsername}
            bind:this={riotNameInput}
        />
    </label>

    <button class="btn w-full preset-filled-primary-500" type="submit">
        Fetch account details
    </button>
</form>
