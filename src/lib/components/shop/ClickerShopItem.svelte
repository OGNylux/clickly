<script lang="ts">
    import { formatNumber } from "$lib/formatNumber";
    import { emojis, unlockedClicker } from "$lib/store";
    import { Lock } from "lucide-svelte";

    export let action: boolean;
    export let numberOfItems: number;

    let buyable = true;
    let marketValue: number;

    $: if (!action && numberOfItems)marketValue = $unlockedClicker.nextSell(numberOfItems);
    else marketValue = $unlockedClicker.nextCost(numberOfItems);

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

    $: if (action == false) buyable = true;
    else if ($emojis < $unlockedClicker.nextCost(numberOfItems)) buyable = false;
    else buyable = true;
</script>

<div class="flex place-content-start bg-slate-200 w-96 rounded-xl">
    <img src={$unlockedClicker.image.src} alt="" class="size-16 p-2 drop-shadow" />
    <div class="grid grid-rows-2 grid-cols-2 grow p-2 w-full">
        <p class="font-bold col-span-2">{$unlockedClicker.name}</p>
        <span title={formatNumber(marketValue) + " E"} class="truncate">{formatNumber(marketValue)} E</span>
        <span title={formatNumber($unlockedClicker.getIncomeMultiplier()) + " E/c"} class="truncate text-end">{action ? '+' : '-'}{formatNumber(Math.floor($unlockedClicker.getIncomeMultiplier()))} E/c</span>
    </div>
    {#if $unlockedClicker.getAmount() == 0 && !action}
        <div class="flex justify-center items-center buy_button transition font-bold text-xl w-40 bg-slate-300 border-slate-200 border-2">
            <Lock size={32} />
        </div>
    {:else}
        <button
            on:click={() => (action ? buyClick() : sellClick())}
            class={`buy_button transition font-bold text-xl border-slate-200 w-40 border-2 ${buyable ? "bg-slate-100 hover:bg-white " : "bg-slate-300 border-slate-200"}`}>
            {action ? "BUY" : "SELL"}
        </button>
    {/if}
</div>

<style>
    .buy_button {
        border-radius: 0px 12px 12px 0px;
    }
</style>
