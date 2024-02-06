<script lang="ts">
    import { storeItems } from "$lib/data";
    import ShopItem from "./ShopItem.svelte";
    
    let buy = true;
    let numberOfItems = 1;

    function toggleItems(n: number) {
        numberOfItems = n;
    }
</script>

<div class="flex flex-col gap-2">
    <div class="grid grid-flow-col grid-cols-1">
        <div class="grid grid-cols-2 w-28 font-medium border-slate-200 border-2 rounded-xl">
            <button on:click={() => buy = true} class={`button1 ${buy ? 'bg-slate-100' : 'bg-slate-300'}`}>Buy</button>
            <button on:click={() => buy = false} class={`button2 ${!buy ? 'bg-slate-100' : 'bg-slate-300'}`}>Sell</button>
        </div>
        <div class="grid grid-cols-3 w-32 font-medium border-slate-200 border-2 rounded-xl">
            <button on:click={() => toggleItems(1)} class={`button1 ${numberOfItems == 1 ? 'bg-slate-100' : 'bg-slate-300'}`}>1</button>
            <button on:click={() => toggleItems(10)} class={`${numberOfItems == 10 ? 'bg-slate-100' : 'bg-slate-300'}`}>10</button>
            <button on:click={() => toggleItems(100)} class={`button2 ${numberOfItems == 100 ? 'bg-slate-100' : 'bg-slate-300'}`}>100</button>
        </div>
    </div>
    {#each storeItems as storeItem}
        <div class="flex items-center gap-2">
            <ShopItem storeItem={storeItem} bind:action={buy} bind:numberOfItems={numberOfItems} />
        </div>
    {/each}
</div>

<style>
    .button1 {
        border-radius: 10px 0px 0px 10px;
    }
    .button2 {
        border-radius: 0px 10px 10px 0px;
    }
</style>