<script lang="ts">
    import "../app.css";
    import Debug from "$lib/components/Debug.svelte";
    import { dev } from "$app/environment";
    import { SvelteToast } from '@zerodevx/svelte-toast'
</script>

<!-- {#if dev} -->
    <Debug />
<!-- {/if} -->
<SvelteToast options={{ reversed: true, intro: { y: 192 } }}/>
<slot></slot>