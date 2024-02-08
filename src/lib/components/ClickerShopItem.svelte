<script lang="ts">
    import { emojis, unlockedClicker } from "$lib/store";
    import Tooltip from "./Tooltip.svelte";

    export let action: boolean;
    export let numberOfItems: number;

    let storeItem = $unlockedClicker;
    let buyable: boolean = true

    function buy() {
        if($emojis >= storeItem.nextCostFunction(numberOfItems)){
            emojis.decrement(storeItem.nextCostFunction(numberOfItems));
            for (let i = 1; i <= numberOfItems; i++) {
                storeItem.buy();
            }
        }
    }
    
    function sell() {
        storeItem.sell();
    }

    $: if ($emojis < $unlockedClicker.nextCostFunction(1) * numberOfItems) buyable = false;
       else buyable = true;
</script>

<div class="grid grid-flow-col grid-cols-4 place-content-start bg-slate-200 w-96 rounded-xl">
    <img src={storeItem.image.src} alt="" class="size-16 p-2 drop-shadow-xl">
    <div class="flex flex-col justify-between p-2 col-span-2">
        <Tooltip>
            <p>{storeItem.name}</p>
            <p>${$unlockedClicker.nextCostFunction(1)}E</p>
            <div slot="tip">
                <p>{storeItem.description}</p>
            </div>
        </Tooltip>
    </div>

    <button on:click={() => action ? buy() : sell()} class={`buy_button ${buyable ? 'bg-slate-100 hover:bg-slate-300 transition font-bold border-slate-200 border-2' : 'bg-slate-300 font-bold border-slate-200 border-2'}`}>
        {action ? "BUY" : "SELL"}
    </button>
</div>

<style>
    .buy_button {
        border-radius: 0px 12px 12px 0px;
    }
</style>