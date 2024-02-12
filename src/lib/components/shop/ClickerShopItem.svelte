<script lang="ts">
    import { emojis, unlockedClicker } from "$lib/store";

    export let action: boolean;
    export let numberOfItems: number;

    let buyable = true;
    let marketValue: number;

    $: if (!action && numberOfItems){
        if (numberOfItems == 1) marketValue = Math.round($unlockedClicker.nextCost(0) * 0.3);
        else marketValue = Math.round($unlockedClicker.nextSell($unlockedClicker.getAmount()-numberOfItems) * 0.3);
    } else {
        marketValue = $unlockedClicker.nextCost(numberOfItems);
    }

    function buyClick() {
        if ($emojis < $unlockedClicker.nextCost(numberOfItems)) return;
        emojis.decrement(marketValue);
        $unlockedClicker.addItem(numberOfItems);
    }

    function sellClick() {
        if ($unlockedClicker.getAmount() == 0) return;
        let sellValue = marketValue;
        $unlockedClicker.removeItem(numberOfItems);
        emojis.increment(sellValue);
    }

    //Sellen kann man immer
    $: if (action == false) buyable = true;
    //Wenn genügend Emojis vorhanden dann kann man es buyen
    else if ($emojis < $unlockedClicker.nextCost(numberOfItems))
        buyable = false;
    //Sonst halt nicht
    else buyable = true;
</script>

<div class="grid grid-flow-col grid-cols-4 place-content-start bg-slate-200 w-96 rounded-xl">
    <img src={$unlockedClicker.image.src} alt="" class="size-16 p-2 drop-shadow-xl" />
    <div class="flex flex-col justify-between p-2 col-span-2">
        <p>{$unlockedClicker.name}</p>
        <p>{marketValue}</p>
    </div>

    {#if !$unlockedClicker.checkRemoveAmount(numberOfItems) && !action}
        <button disabled class="bg-slate-300 font-bold border-slate-200 border-2 buy_button rounded-xl">
            <span class="line-through">SELL</span>
        </button>
    {:else}
        <button
            on:click={() => (action ? buyClick() : sellClick())}
            class={`buy_button transition font-bold border-slate-200 border-2 ${buyable ? "bg-slate-100 hover:bg-white " : "bg-slate-300 border-slate-200"}`}>
            {action ? "BUY" : "SELL"}
        </button>
    {/if}
</div>

<style>
    .buy_button {
        border-radius: 0px 12px 12px 0px;
    }
</style>
