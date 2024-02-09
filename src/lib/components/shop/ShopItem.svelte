<script lang="ts">
    import type { StoreItem } from "$lib/data";
    import { emojis, unlockedPassiveItems } from "$lib/store";

    export let action: boolean;
    export let numberOfItems: number;
    export let itemIndex: number;

    let item: StoreItem = $unlockedPassiveItems[itemIndex];

    unlockedPassiveItems.subscribe((value) => {
        item = value[itemIndex];
    });
    let marketValue: number;

    $: if (!action)
        marketValue = Math.round(
            $unlockedPassiveItems[itemIndex].nextCost(numberOfItems) * 0.3,
        );
    else marketValue = $unlockedPassiveItems[itemIndex].nextCost(numberOfItems);

    let buyable = true;

    function buyClick() {
        if ($emojis < item.nextCost(numberOfItems)) return;
        $emojis -= item.nextCost(numberOfItems);
        item.addItem(numberOfItems);
    }

    function sellClick() {
        if (item.getAmount() == 0) return;
        let sellValue = Math.round(item.nextCost(numberOfItems) * 0.3);
        item.removeItem(numberOfItems);
        $emojis += sellValue;
    }

    //Sellen kann man immer
    $: if (action == false) buyable = true;
    //Wenn genügend Emojis vorhanden dann kann man es buyen
    else if ($emojis < item.nextCost(numberOfItems)) buyable = false;
    //Sonst halt nicht
    else buyable = true;
</script>

<div
    class="grid grid-flow-col grid-cols-4 place-content-start bg-slate-200 w-96 rounded-xl"
>
    <img src={item.image.src} alt="" class="size-16 p-2 drop-shadow-xl" />
    <div class="flex flex-col justify-between p-2 col-span-2">
        <p>{item.name}</p>
        <p>{marketValue}</p>
    </div>

    {#if item.getAmount() == 0 && action == false}
        <p class="bg-slate-300 font-bold border-slate-200 border-2">
            Nothing to sell
        </p>
    {:else}
        <button
            on:click={() => (action ? buyClick() : sellClick())}
            class={`buy_button transition font-bold border-slate-200 border-2 ${
                buyable
                    ? "bg-slate-100 hover:bg-slate-300 "
                    : "bg-slate-300 border-slate-200"
            }`}
        >
            {action ? "BUY" : "SELL"}
        </button>
    {/if}
</div>

<style lang="postcss">
    .buy_button {
        border-radius: 0px 12px 12px 0px;
    }
</style>
