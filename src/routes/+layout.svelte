<script>
    import { onMount } from "svelte";
    import "../app.css";
    import Debug from "$lib/Debug.svelte";
    import { dev } from "$app/environment";
    import { loadLocalStorage, save } from "$lib/save";

    onMount(() => {
        loadLocalStorage();
        save();
    });
</script>

{#if dev}
    <Debug />
{/if}
<slot></slot>