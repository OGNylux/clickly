<script lang="ts">
    import type { StoreItem } from "$lib/data";
    import { buildings, emojis } from "$lib/store";

    export let storeItem: StoreItem;
    
    let storePrice = storeItem.initialCost;

    function getCost() {
        const costMultiplier = storeItem.costMultiplier * $buildings[storeItem.index];
        return Math.round(storeItem.initialCost * (costMultiplier == 0 ? 1 : costMultiplier));
    }

    function buy(amount = 1) {
        const cost = getCost();
        if ($emojis < cost * amount) return;
        
        emojis.decrement(cost * amount);
        buildings.increment(amount, storeItem.index);
    }

    $ : if ($buildings){
            storePrice = getCost();
        }
</script>

<div class="grid grid-flow-col grid-cols-4 place-content-start bg-slate-200 w-96 rounded-xl">
    <img src={storeItem.image.src} alt="" class="size-16 p-2">
    <div class="flex flex-col justify-between p-2 col-span-2">
        <p>{storeItem.name}</p>
        <p>${storePrice}E</p>
    </div>
        
    <button on:click={()=> buy()} class="p-2 bg-slate-100 buy_button hover:bg-slate-300 transition font-bold border-slate-200 border-2">BUY</button>
</div>

<style>
    .buy_button {
        border-radius: 0px 12px 12px 0px;
    }
</style>