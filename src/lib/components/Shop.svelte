<script lang="ts">
    import { storeItems } from "$lib/data";
    import { buildings, emojis, score } from "$lib/store";
    import { onDestroy, onMount } from "svelte";
    import BuyItem from "./BuyItem.svelte";
    import SellItem from "./SellItem.svelte";
    
    let passiveIncome = Array(8).fill(0),
        interval = 0;
    
    let buy = true;
    let sell = false;

    onMount(() => {
        interval = setInterval(() => {
            for (let i = 0; i < storeItems.length; i++) {
                const income = $buildings[i] * storeItems[i].incomeMultiplier;
                if (income == 0) break;

                passiveIncome[i] = income;
                emojis.increment(income);
                score.increment(income);
            }
        }, 1000);
    });

    onDestroy(() => {
        clearInterval(interval);
    });

    function toggleBuy() {
        buy = true;
        sell = false;
    }
    function toggleSell() {
        buy = false;
        sell = true;
    }
</script>

<div class="flex flex-col gap-2">
    <p>passive income: {passiveIncome.reduce((p,a) => p+a, 0)}E/s</p>
    <div class="grid grid-flow-col grid-cols-1">
        <div class="grid grid-cols-2 w-28 font-medium border-slate-200 border-2 rounded-xl">
            <button on:click={toggleBuy} class={`button1 ${buy ? 'bg-slate-100' : 'bg-slate-300'}`}>Buy</button>
            <button on:click={toggleSell} class={`button2 ${sell ? 'bg-slate-100' : 'bg-slate-300'}`}>Sell</button>
        </div>
        <div class="grid grid-cols-3 w-32 font-medium border-slate-200 border-2 rounded-xl">
            <button class="bg-slate-300 button1">1</button>
            <button class="bg-slate-300">10</button>
            <button class="bg-slate-300 button2">100</button>
        </div>
    </div>
    {#if buy}
        {#each storeItems as storeItem}
            <div class="flex items-center gap-2">
                <BuyItem storeItem={storeItem} />
            </div>
        {/each}
    {/if}
    {#if sell}
        {#each storeItems as storeItem}
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