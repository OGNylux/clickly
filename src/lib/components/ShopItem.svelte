<script lang="ts">
    import type { storeItem } from "$lib/data";
    import { buildings, emojis } from "$lib/store";

    export let storeItem: storeItem;
    export let action: boolean;

    let calculatePrice: number;
    let storePrice: number;

    function getPrice() {
        const valueMultiplier = storeItem.valueMultiplier * $buildings[storeItem.index];
        return Math.round(calculatePrice * (valueMultiplier == 0 ? 1 : valueMultiplier));
    }

    function buy(amount = 1) {
        const cost = getPrice();
        if ($emojis < cost * amount) return;
        
        emojis.decrement(cost * amount);
        buildings.increment(amount, storeItem.index);
    }

    function sell(amount = 1) {
        const sell = getPrice();
        if ($buildings[storeItem.index] <= 0) return;
        
        emojis.increment(sell * amount);
        buildings.decrement(amount, storeItem.index);
    }

    $ : if ($buildings){
            storePrice = getPrice();
        }
        if (action){
            calculatePrice = storeItem.initialCost;
        } else {
            calculatePrice = storeItem.sell;
        }
</script>

<div class="grid grid-flow-col grid-cols-4 place-content-start bg-slate-200 w-80 rounded-xl">
    <img src={storeItem.image.src} alt="" class="size-16 p-2">
    <div class="flex flex-col justify-between p-2 col-span-2">
        <p>{storeItem.name}</p>
        <p class="text-sm italic">{storeItem.description}</p>
        <p>${storePrice}E</p>
    </div>

    <button on:click={() => action ? buy() : sell()} class="p-2 bg-slate-100 buy_button hover:bg-slate-300 transition font-bold border-slate-200 border-2">
        {action ? "BUY" : "SELL"}
    </button>
</div>

<style>
    .buy_button {
        border-radius: 0px 12px 12px 0px;
    }
</style>