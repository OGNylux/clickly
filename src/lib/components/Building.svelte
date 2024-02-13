<script lang="ts">
    import { ClickerItem, PassiveIncomeItem, StoreItem } from "$lib/data";
    import { ArrowBigUpDash } from "lucide-svelte";
    import { StoreItem } from "$lib/data";
    import Emoji from "./Emoji.svelte";

    export let storeItem: StoreItem;
</script>   
<div class="flex bg-slate-200 z-10 rounded-xl w-96 relative h-[66px]">
    <div class="m-2 mt-1 w-full">
        {#if storeItem.getAmount() > 0}
            <p class="font-bold">{storeItem.name}</p>
        {/if}
        <div class="flex h-8 -space-x-4 rtl:space-x-reverse">
            {#each {length: Math.min(storeItem.getAmount(), 10)} as _}
                {#if storeItem.component}
                    <Emoji emoji={storeItem.component} animated={true} />
                {:else}
                    <img src={storeItem.image.src} alt="" class="filter drop-shadow size-8">
                {/if}
            {/each}
        </div>
    </div>
    <div class="flex -space-x-9 rtl:space-x-reverse text-white">
        <div class="flex rounded-xl bg-slate-500 border-slate-200 border-2">
            <button class="ml-2 mr-10">
                <ArrowBigUpDash size={40}/>
            </button>
        </div>
        <div class="rounded-xl w-32 p-2 text-center border-2 bg-slate-600">
            <p class="text-4xl truncate">{storeItem.getAmount()}</p>
            {#if storeItem instanceof ClickerItem}
                <p class="text-sm truncate -m-2">{storeItem.getInfluence()+1} E/c</p>
            {:else if storeItem instanceof PassiveIncomeItem}
                <p class="text-sm truncate -m-2">{storeItem.getInfluence()} E/s</p>
            {/if}
        </div>
    </div>
    {#if storeItem.getAmount() == 0}
        <div class="absolute flex justify-center items-center w-full h-full bg-slate-200 bg-opacity-90 rounded-xl z-11">
            <span class="font-bold text-4xl">???</span>
        </div>
    {/if}
</div>