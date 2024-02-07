<script lang="ts">
    import type { StoreItem } from "$lib/data";
    import { buildings, emojis } from "$lib/store";
    import Tooltip from "./Tooltip.svelte";

    export let storeItem: StoreItem;
    export let action: boolean;
    export let numberOfItems: number;

    let calculatePrice = action ? storeItem.initialCost : storeItem.sell;
    let storePrice: number;

    function getPrice() {
        const valueMultiplier = storeItem.valueMultiplier * $buildings[storeItem.index];
        return Math.round(calculatePrice * (valueMultiplier == 0 ? 1 : valueMultiplier));
    }

    function buy(amount = 1) {
        for (let i = 1; i <= numberOfItems; i++) {
            const cost = getPrice();
            if ($emojis < cost * amount) return;
            
            emojis.decrement(cost * amount);
            buildings.increment(amount, storeItem.index);
        }
    }

    function sell(amount = 1) {
        for (let i = 1; i <= numberOfItems; i++) {
            const sell = getPrice();
            if ($buildings[storeItem.index] <= 0) return;
            
            emojis.increment(sell * amount);
            buildings.decrement(amount, storeItem.index);
        }
    }

    $ : if ($buildings){
            storePrice = getPrice();
        }
</script>

<div class="grid grid-flow-col grid-cols-4 place-content-start bg-slate-200 w-96 rounded-xl">
    <img src={storeItem.image.src} alt="" class="size-16 p-2">
    <div class="flex flex-col justify-between p-2 col-span-2">
        <Tooltip>
            <p>{storeItem.name}</p>
            <p>${storePrice}E</p>
            <div slot="tip">
                <p>passives Einkommen: <span>{storeItem.incomeMultiplier}E/s</span></p>
            </div>
        </Tooltip>
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