<script lang="ts">
    import type { Snippet } from 'svelte';

    let {
        href,
        type = 'button',
        class: className = '',
        children
    }: {
        /** When set, renders an anchor instead of a button. */
        href?: string;
        type?: 'button' | 'submit';
        class?: string;
        children: Snippet;
    } = $props();
</script>

{#if href}
    <a class="btn bg-primary-800 text-primary-contrast-500 {className}" {href}
        >{@render children()}</a
    >
{:else}
    <button class="btn bg-primary-800 text-primary-contrast-500 {className}" {type}>
        {@render children()}
    </button>
{/if}
