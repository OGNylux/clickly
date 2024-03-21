<script lang="ts">
    import "../app.css";
    import Debug from "$lib/components/Debug.svelte";
    import { dev } from "$app/environment";
    import { SvelteToast } from '@zerodevx/svelte-toast'
</script>

<!-- {#if dev}
    <Debug />
{/if}  -->
    <Debug />
<SvelteToast options={{ pausable: true, intro: { y: 192 }, reversed: true }}/>
<slot></slot>