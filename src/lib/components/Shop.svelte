<script>
    import { storeItems } from "$lib/data";
    import { buildings, emojis } from "$lib/store";
    import { onDestroy, onMount } from "svelte";

    let emojisLocal = 0,
        buildingsLocal = Array(8).fill(0),
        passiveIncome = Array(8).fill(0),
        interval = 0;

    const unsubscribeEmojis = emojis.subscribe(v => emojisLocal = v);
    const unsubscribeBuildings = buildings.subscribe(v => { buildingsLocal = v; passiveIncome = Array(8).fill(0); });

    function buy(amount = 1, index = 0) {
        const item = storeItems[index];
        // calculate cost with multiplier for each bought building
        const cost = Math.round(item.initialCost * (buildingsLocal[item.index] < 1 ? 1 : item.costMultiplier * buildingsLocal[item.index]));
        if (emojisLocal < cost * amount) return;
        
        emojis.decrement(cost * amount);
        buildings.increment(amount, index);
    }


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

<div class="grid">
    <p>passive income: {passiveIncome.reduce((p,a) => p+a, 0)}</p>
    {#each storeItems as storeItem}
        <div class="flex">
            <img src={storeItem.image.src} alt={storeItem.image.alt} class="size-12">
            <div>
                <p>{storeItem.name}</p>
                <p>{Math.round(storeItem.initialCost * (buildingsLocal[storeItem.index] < 1 ? 1 : storeItem.costMultiplier * buildingsLocal[storeItem.index]))}</p>
            </div>
            <button on:click={() => buy(1, storeItem.index)}>
                BUY
            </button>
        </div>
    {/each}
</div>