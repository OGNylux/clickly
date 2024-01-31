<script>
    // @ts-nocheck
    import { buildings, emojis } from "$lib/store";

    export let storeItem;
    
    let emojisLocal = 0,
        buildingsLocal = Array(8).fill(0),
        cost = storeItem.initialCost;   
    
    const unsubscribeEmojis = emojis.subscribe(v => emojisLocal = v);
    const unsubscribeBuildings = buildings.subscribe(v => buildingsLocal = v);

    function buy(amount = 1) {
        // calculate cost with multiplier for each bought building
        cost = Math.round(storeItem.initialCost * (buildingsLocal[storeItem.index] == 0 ? 1 : storeItem.costMultiplier * buildingsLocal[storeItem.index]));
        if (emojisLocal < cost * amount) return;
        
        emojis.decrement(cost * amount);
        buildings.increment(amount, storeItem.index);
    }
    
</script>

<div class="grid grid-flow-col grid-cols-4 place-content-start bg-slate-200 w-80 rounded-xl">
    <img src={storeItem.image.src} alt="" class="size-16 p-2">
    <div class="flex flex-col justify-between p-2 col-span-2">
        <p>{storeItem.name}</p>
        <p>${Math.round(storeItem.initialCost * (buildingsLocal[storeItem.index] == 0 ? 1 : storeItem.costMultiplier * buildingsLocal[storeItem.index]))}E</p>
    </div>
        
    <button on:click={()=> buy()} class="p-2 bg-slate-100 buy_button hover:bg-slate-300 transition font-bold border-slate-200 border-2">BUY</button>
</div>

<style>
    .buy_button {
        border-radius: 0px 12px 12px 0px;
    }
</style>