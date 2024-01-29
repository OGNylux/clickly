<script>
    import "../app.css";
    import Debug from "$lib/Debug.svelte";
    import { dev } from "$app/environment";
</script>

{#if dev}
    <Debug />
{/if}
<slot></slot>