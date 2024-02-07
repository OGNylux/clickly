<script lang="ts">
    import type { StoreItem } from "$lib/data";
    import { buildings } from "$lib/store";
    import Emoji from "./Emoji.svelte";

    export let storeItem: StoreItem;

    let test = false
</script>

<div class="grid grid-cols-3 w-80 bg-slate-200 rounded-xl">
    <div class="col-span-2 m-2">
        <p>{storeItem.name}</p>
        <div class="flex h-8 -space-x-4 rtl:space-x-reverse">
            {#each {length: Math.min($buildings[storeItem.index], 10)} as _}
                {#if storeItem.component}
                    <Emoji emoji={storeItem.component} animated={true} />
                {:else}
                    <img src={storeItem.image.src} alt="" class="filter drop-shadow size-8">
                {/if}
            {/each}
        </div>
    </div>
    <div class="grid rounded-xl justify-center justify-items-center bg-slate-600 border-2 border-slate-200 text-white">
        <p class="text-4xl">{$buildings[storeItem.index]}</p>
        <p class="text-sm justify-self-center space-y-2">{$buildings[storeItem.index]*storeItem.multiplier} E/s</p>
    </div>
</div>