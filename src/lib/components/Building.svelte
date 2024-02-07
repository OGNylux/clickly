<script lang="ts">
    import type { StoreItem } from "$lib/data";
    import { buildings } from "$lib/store";
    import Emoji from "./Emoji.svelte";
    import { ArrowBigUpDash } from 'lucide-svelte';

    export let storeItem: StoreItem;

    let test = false
</script>

<div class="flex bg-slate-200 w-96 rounded-xl">
    <div class="m-2 w-full">
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
    <div class="flex rounded-xl bg-slate-500 justify-self-end justify-center items-center upgrade_button">
        <button class="ml-2">
            <ArrowBigUpDash size={40} class="text-white"/>
        </button>
        <div class="rounded-xl h-full w-32 p-2 text-center border-slate-200 border-2 bg-slate-600 text-white">
            <p class="text-4xl truncate">{$buildings[storeItem.index]}</p>
            {#if storeItem.index == 0}
                <p class="text-sm truncate -m-2">{$buildings[storeItem.index]+1} E/c</p>
            {:else}
                <p class="text-sm truncate -m-2">{$buildings[storeItem.index]*storeItem.multiplier} E/s</p>
            {/if}
        </div>
    </div>
</div>

<style>
    .upgrade_button {
        border-radius: 12px 20px 20px 12px;
    }
</style>