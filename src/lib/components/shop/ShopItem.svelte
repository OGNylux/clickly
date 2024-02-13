<script lang="ts">
    import type { StoreItem } from "$lib/data";
    import { formatNumber } from "$lib/helper";
    import { emojis, unlockedPassiveItems } from "$lib/store";
    import { Lock } from "lucide-svelte";

    export let action: boolean;
    export let numberOfItems: number;
    export let itemIndex: number;

    let item: StoreItem = $unlockedPassiveItems[itemIndex];
    let marketValue: number;
    let buyable = true;

    unlockedPassiveItems.subscribe((value) => {
        item = value[itemIndex];
    });

    $: if (!action && numberOfItems) marketValue = item.nextSell(numberOfItems);
    else marketValue = $unlockedPassiveItems[itemIndex].nextCost(numberOfItems);

    function buyClick() {
        if ($emojis < item.nextCost(numberOfItems)) return;

        emojis.decrement(marketValue);
        item.addItem(numberOfItems);
    }

    function sellClick() {
        if (item.getAmount() == 0) return;

        let sellValue = Math.round(item.nextCost(numberOfItems) * 0.3);
        item.removeItem(numberOfItems);
        emojis.increment(sellValue);
    }

    $: if (action == false) buyable = true;
    // if you have enough emojis, set buyable to true
    else if ($emojis < item.nextCost(numberOfItems)) buyable = false;
    else buyable = true;
</script>

<div class="grid grid-flow-col grid-cols-4 place-content-start bg-slate-200 w-96 rounded-xl">
    <img src={item.image.src} alt="" class="size-16 p-2 drop-shadow-xl" />
    <div class="flex flex-col justify-between p-2 col-span-2">
        <p>{item.name}</p>
        <p>{formatNumber(marketValue)}</p>
    </div>

    {#if !item.checkAddAmount(numberOfItems) && action}
        <button disabled class="flex justify-center items-center bg-slate-300 font-bold border-slate-200 border-2 buy_button">
            <Lock size={32} />
        </button>
    {:else if !item.checkRemoveAmount(numberOfItems) && !action}
        <div class="flex justify-center items-center bg-slate-300 font-bold border-slate-200 border-2 buy_button">
            <Lock size={32} />
        </div>
    {:else}
        <button on:click={() => (action ? buyClick() : sellClick())} 
            class={`buy_button transition font-bold border-slate-200 border-2 ${buyable ? "bg-slate-100 hover:bg-white " : "bg-slate-300 border-slate-200"}`}>
            {action ? "BUY" : "SELL"}
        </button>
    {/if}
</div>

<style lang="postcss">
    .buy_button {
        border-radius: 0px 12px 12px 0px;
    }
</style>
