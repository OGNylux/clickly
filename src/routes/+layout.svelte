<script lang="ts">
    import "../app.css";
    import Debug from "$lib/components/Debug.svelte";
    import { dev } from "$app/environment";
</script>

<!-- {#if dev} -->
    <Debug />
<!-- {/if} -->
<slot></slot>