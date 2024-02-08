<script lang="ts">
    import { unlockedClicker } from "$lib/store";
    import ShopItem from "./ShopItem.svelte";
    
    let buy = true;
    let numberOfItems = 1;

    function toggleItems(n: number) {
        numberOfItems = n;
    }
</script>

<div class="flex flex-col gap-2 mr-1">
    <div class="grid grid-flow-col grid-cols-1 mx-1">
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
    <div class="border-slate-100 border-2 bg-slate-50 rounded-xl p-1">
        {#if buy}
            {#each $unlockedClicker as _,i}
                <div class="flex items-center py-1">
                    <ShopItem indexStoreItem={i} bind:action={buy} bind:numberOfItems={numberOfItems} />
                </div>
            {/each}
        {:else}
            {#each $unlockedClicker as _,i}
                <div class="flex items-center py-1">
                    <ShopItem indexStoreItem={i} bind:action={buy} bind:numberOfItems={numberOfItems} />
                </div>
            {/each}
        {/if}
    </div>
</div>

<style>
    .button1 {
        border-radius: 10px 0px 0px 10px;
    }
    .button2 {
        border-radius: 0px 10px 10px 0px;
    }
</style>