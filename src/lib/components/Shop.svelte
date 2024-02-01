<script lang="ts">
    import { storeItems } from "$lib/data";
    import { buildings, emojis, score } from "$lib/store";
    import { onDestroy, onMount } from "svelte";
    import BuyItem from "./BuyItem.svelte";
    import SellItem from "./SellItem.svelte";
    
    let passiveIncome = Array(8).fill(0),
        interval = 0;
    
    let buy = true;

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

    function toggleShop() {
    buy = !buy;
    }
</script>

<div class="flex flex-col gap-2">
    <p>passive income: {passiveIncome.reduce((p,a) => p+a, 0)}E/s</p>
    <div class="grid grid-flow-col grid-cols-2">
        <div class="grid grid-cols-2 bg-slate-100 rounded-xl w-24 font-medium">
            <button on:click={toggleShop} class="has-[:checked]:bg-slate-300 rounded-full buy_button">Buy</button>
            <button on:click={toggleShop} class="bg-slate-300 rounded-full sell_button">Sell</button>
        </div>
        <div class="grid grid-cols-3 bg-slate-100 rounded-xl w-24 font-medium justify-start">
            <button class="has-[:checked]:bg-slate-300 rounded-full buy_button">1</button>
            <button class="bg-slate-300">10</button>
            <button class="bg-slate-300 rounded-full sell_button">100</button>
        </div>
    </div>
    {#if buy}
        {#each storeItems as storeItem}
            <div class="flex items-center gap-2">
                <BuyItem storeItem={storeItem} />
            </div>
        {/each}
    {:else}
        {#each storeItems as storeItem}
            <div class="flex items-center gap-2">
                <SellItem storeItem={storeItem} />
            </div>
        {/each}
    {/if}
</div>

<style>
    .sell_button {
        border-radius: 0px 12px 12px 0px;
    }
    .buy_button {
        border-radius: 12px 0px 0px 12px;
    }
</style>