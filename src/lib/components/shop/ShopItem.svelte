<script lang="ts">
    import type { StoreItem } from "$lib/data";
    import { formatNumber } from "$lib/formatNumber";
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
    <div class="grid grid-rows-2 grid-cols-2 grow p-2 w-full">
        <p class="font-bold col-span-2">{item.name}</p>
        <span title={formatNumber(marketValue) + " E"} class="truncate">{formatNumber(marketValue)} E</span>
        <span title={formatNumber(item.getIncomeMultiplier()) + " E/s"} class="truncate text-end">+{formatNumber(Math.floor(item.getIncomeMultiplier()))} E/s</span>
    </div>
    {#if item.getAmount() == 0 && !action}
        <button disabled class="flex justify-center items-center w-40 bg-slate-300 font-bold text-xl border-slate-200 border-2 buy_button">
            <Lock size={32} />
        </button>
    {:else}
        <button on:click={() => (action ? buyClick() : sellClick())} 
            class={`buy_button transition font-bold text-xl w-40 border-slate-200 border-2 ${buyable ? "bg-slate-100 hover:bg-white " : "bg-slate-300 border-slate-200"}`}>
            {action ? "BUY" : "SELL"}
        </button>
    {/if}
</div>

<style lang="postcss">
    .buy_button {
        border-radius: 0px 12px 12px 0px;
    }
</style>
