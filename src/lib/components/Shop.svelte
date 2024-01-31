<script lang="ts">
    import { storeItems } from "$lib/data";
    import { buildings, emojis } from "$lib/store";
    import { onDestroy, onMount } from "svelte";
    import ShopItem from "./ShopItem.svelte";
    
    let buildingsLocal = Array(8).fill(0),
        passiveIncome = Array(8).fill(0),
        interval = 0;
    
    const unsubscribeBuildings = buildings.subscribe(v => buildingsLocal = v);

    onMount(() => {
        interval = setInterval(() => {
            for (let i = 0; i < storeItems.length; i++) {
                const income = buildingsLocal[i] * storeItems[i].multiplier;
                if (income == 0) break;

                passiveIncome[i] = income;
                emojis.increment(income);
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