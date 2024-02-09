<script lang="ts">
    import { emojis, unlockedClicker } from "$lib/store";

    export let action: boolean;
    export let numberOfItems: number;

    let storeItem = $unlockedClicker;
    let buyable = true;

    function buyClick() {
        if ($emojis < $unlockedClicker.nextCost(numberOfItems)) return;
        $emojis -= $unlockedClicker.nextCost(numberOfItems);
        $unlockedClicker.addItem(numberOfItems);
    }

    function sellClick() {
        let sellValue = Math.round(
            $unlockedClicker.nextCost(numberOfItems) * 0.3,
        );
        $unlockedClicker.removeItem(numberOfItems);
        $emojis += sellValue;
    }

    //Sellen kann man immer
    $: if (action == false) buyable = true;
    //Wenn genügend Emojis vorhanden dann kann man es buyen
    else if ($emojis < $unlockedClicker.nextCost(numberOfItems))
        buyable = false;
    //Sonst halt nicht
    else buyable = true;
</script>

<div
    class="grid grid-flow-col grid-cols-4 place-content-start bg-slate-200 w-96 rounded-xl"
>
    <img src={storeItem.image.src} alt="" class="size-16 p-2 drop-shadow-xl" />
    <div class="flex flex-col justify-between p-2 col-span-2">
        <p>{$unlockedClicker.name}</p>
        <p>{$unlockedClicker.nextCost(numberOfItems)}</p>
    </div>

    {#if $unlockedClicker.getAmount() == 0 && action == false}
        <p class="bg-slate-300 font-bold border-slate-200 border-2">
            Nothing to sell
        </p>
    {:else}
        <button
            on:click={() => (action ? buyClick() : sellClick())}
            class={`buy_button ${
                buyable
                    ? "bg-slate-100 hover:bg-slate-300 transition font-bold border-slate-200 border-2"
                    : "bg-slate-300 font-bold border-slate-200 border-2"
            }`}
        >
            {action ? "BUY" : "SELL"}
        </button>
    {/if}
</div>

<style>
    .buy_button {
        border-radius: 0px 12px 12px 0px;
    }
</style>
