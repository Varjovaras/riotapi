<script lang="ts">
    import { goto } from '$app/navigation';
    import { accountViewHref } from '#lib/utils/hrefs.js';
    import { REGIONS, type Region } from '#lib/utils/regions.js';

    let riotNameInput: HTMLInputElement | null = $state(null);
    let riotUsername = $state('');
    let region = $state<Region>('euw');
    let errorMessage = $state('');

    function handleSubmit(event: SubmitEvent) {
        event.preventDefault();
        console.log('[AccountForm] form submitted', { name: riotUsername, region });
        const [riotIdName, riotIdTag, ...rest] = riotUsername.trim().split('#');
        if (!riotIdName || !riotIdTag || rest.length > 0) {
            showError('Enter your Riot ID as name#tag');
            riotNameInput?.focus();
            return;
        }
        // The url carries region/name/tag; the /matches load resolves the account.
        const href = accountViewHref('matches', { region, name: riotIdName, tag: riotIdTag });
        console.log('[AccountForm] navigating to matches', { href });
        void goto(href);
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
        <span class="label-text text-xs">Region</span>
        <select class="select" bind:value={region}>
            {#each Object.entries(REGIONS) as [code, info] (code)}
                <option value={code}>{info.label}</option>
            {/each}
        </select>
    </label>

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

    <button class="btn w-full bg-primary-800 text-primary-contrast-500" type="submit">
        Fetch account details
    </button>
</form>
