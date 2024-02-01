<script lang="ts">
    import type { storeItem } from "$lib/data";
    import { buildings, emojis } from "$lib/store";

    export let storeItem: storeItem;
    
    let storeSell = storeItem.sell;

    function sell(amount = 1) {
        const sell = storeItem.sell;
        if ($buildings[storeItem.index] <= 0) return;
        
        emojis.increment(sell * amount);
        buildings.decrement(amount, storeItem.index);
    }

    $ : if ($buildings){
            storeSell = storeItem.sell;
        }
</script>

<div class="grid grid-flow-col grid-cols-4 place-content-start bg-slate-200 w-80 rounded-xl">
    <img src={storeItem.image.src} alt="" class="size-16 p-2">
    <div class="flex flex-col justify-between p-2 col-span-2">
        <p>{storeItem.name}</p>
        <p>${storeSell}E</p>
    </div>
        
    <button on:click={()=> sell()} class="p-2 bg-slate-100 sell_button hover:bg-slate-300 transition font-bold border-slate-200 border-2">SELL</button>
</div>

<style>
    .sell_button {
        border-radius: 0px 12px 12px 0px;
    }
</style>