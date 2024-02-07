<script lang="ts">
    import type { StoreItem } from "$lib/data";
    import { buildings } from "$lib/store";
    import Emoji from "./Emoji.svelte";

    export let storeItem: StoreItem;
</script>

<div class="flex w-96 bg-slate-200 rounded-xl p-2">
    {#if storeItem.component}
        <Emoji emoji={storeItem.component} animated={true}/>
    {:else}
        <img src={storeItem.image.src} alt="">
    {/if}
    <p class="text-5xl">{$buildings[storeItem.index]}</p>
</div>