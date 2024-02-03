<script lang="ts">
    import { storeItems } from "$lib/data";
    import BuyItem from "./BuyItem.svelte";
    import SellItem from "./SellItem.svelte";
    
    let buy = true;
    let sell = false;
    let numberOfItems = 1;

    function toggleBuy() {
        buy = true;
        sell = false;
    }
    function toggleSell() {
        buy = false;
        sell = true;
    }
    function toggleItems(n: number) {
        numberOfItems = n;
    }
</script>

<div class="flex flex-col gap-2">
    <div class="grid grid-flow-col grid-cols-1">
        <div class="grid grid-cols-2 w-28 font-medium border-slate-200 border-2 rounded-xl">
            <button on:click={toggleBuy} class={`button1 ${buy ? 'bg-slate-100' : 'bg-slate-300'}`}>Buy</button>
            <button on:click={toggleSell} class={`button2 ${sell ? 'bg-slate-100' : 'bg-slate-300'}`}>Sell</button>
        </div>
        <div class="grid grid-cols-3 w-32 font-medium border-slate-200 border-2 rounded-xl">
            <button on:click={() => toggleItems(1)} class={`button1 ${numberOfItems == 1 ? 'bg-slate-100' : 'bg-slate-300'}`}>1</button>
            <button on:click={() => toggleItems(10)} class={`${numberOfItems == 10 ? 'bg-slate-100' : 'bg-slate-300'}`}>10</button>
            <button on:click={() => toggleItems(100)} class={`button2 ${numberOfItems == 100 ? 'bg-slate-100' : 'bg-slate-300'}`}>100</button>
        </div>
    </div>
    {#if buy}
        {#each storeItems.slice(0, numberOfItems) as storeItem}
            <div class="flex items-center gap-2">
                <BuyItem storeItem={storeItem} />
            </div>
        {/each}
    {/if}
    {#if sell}
        {#each storeItems.slice(0, numberOfItems) as storeItem}
            <div class="flex items-center gap-2">
                <SellItem storeItem={storeItem} />
            </div>
        {/each}
    {/if}
</div>

<style>
    .button1 {
        border-radius: 10px 0px 0px 10px;
    }
    .button2 {
        border-radius: 0px 10px 10px 0px;
    }
</style>