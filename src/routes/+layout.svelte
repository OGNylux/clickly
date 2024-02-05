<script lang="ts">
    import { onMount } from "svelte";
    import "../app.css";
    import Debug from "$lib/components/Debug.svelte";
    import { dev } from "$app/environment";
    import { loadLocalStorage, save } from "$lib/save";

    loadLocalStorage();
    save();
</script>

{#if dev}
    <Debug />
{/if}
<slot></slot>