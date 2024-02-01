<script lang="ts">
    import { storeItems } from "$lib/data";
    import { buildings, emojis, score } from "$lib/store";
    import { onDestroy, onMount } from "svelte";
    import ShopItem from "./ShopItem.svelte";
    
    let passiveIncome = Array(8).fill(0),
        interval = 0;
    

    onMount(() => {
        interval = setInterval(() => {
            for (let i = 1; i < storeItems.length; i++) {
                const income = $buildings[i] * storeItems[i].multiplier;
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
</script>

<div class="flex flex-col gap-2">
    <p>passive income: {passiveIncome.reduce((p,a) => p+a, 0)}E/s</p>
    {#each storeItems as storeItem}
        <div class="flex items-center gap-2">
            <ShopItem storeItem={storeItem} />
        </div>
    {/each}
</div>