<script lang="ts">
    import type { StoreItem } from "$lib/data";
    import { test2 } from "$lib/formatNumber";
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
        console.log(test2($emojis))
        if ($emojis < item.nextCost(numberOfItems)) return;
        emojis.decrement(marketValue);
        item.addItem(numberOfItems);
    }

    function sellClick() {
        if (item.getAmount() == 0) return;
        let sellValue = marketValue;
        item.removeItem(numberOfItems);
        emojis.increment(sellValue);
    }

    $: if (action == false) buyable = true;
    // if you have enough emojis, set buyable to true
    else if ($emojis < item.nextCost(numberOfItems)) buyable = false;
    else buyable = true;
</script>

<div class="flex place-content-start bg-slate-200 w-96 rounded-xl">
    <img src={item.image.src} alt="" class="size-16 p-2 drop-shadow" />
    <div class="flex flex-col grow justify-between p-2">
        <p class="font-bold">{item.name}</p>
        <p>{formatNumber(marketValue)}</p>
    </div>

    {#if item.getAmount() == 0 && !action}
        <button disabled class="flex justify-center items-center w-24 bg-slate-300 font-bold text-xl border-slate-200 border-2 buy_button">
            <Lock size={32} />
        </button>
    {:else}
        <button on:click={() => (action ? buyClick() : sellClick())} 
            class={`buy_button transition font-bold text-xl w-24 border-slate-200 border-2 ${buyable ? "bg-slate-100 hover:bg-white " : "bg-slate-300 border-slate-200"}`}>
            {action ? "BUY" : "SELL"}
        </button>
    {/if}
</div>

<style lang="postcss">
    .buy_button {
        border-radius: 0px 12px 12px 0px;
    }
</style>
