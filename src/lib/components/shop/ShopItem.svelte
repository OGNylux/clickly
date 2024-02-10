<script lang="ts">
    import type { StoreItem } from "$lib/data";
    import { formatNumber } from "$lib/helper";
    import { emojis, unlockedPassiveItems } from "$lib/store";

    export let action: boolean;
    export let numberOfItems: number;
    export let itemIndex: number;

    let item: StoreItem = $unlockedPassiveItems[itemIndex];
    let marketValue: number;
    let buyable = true;

    unlockedPassiveItems.subscribe((value) => {
        item = value[itemIndex];
    });

    $: if (!action)
        marketValue = Math.round(
            $unlockedPassiveItems[itemIndex].nextCost(numberOfItems) * 0.3,
        );
    else marketValue = $unlockedPassiveItems[itemIndex].nextCost(numberOfItems);

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
        <p>{formatNumber(marketValue)}</p>
    </div>

    <!-- 
        Wenn der Verkauf nicht möglich ist, da man dann unter 0 fallen würde
     -->
    {#if !item.checkRemoveAmount(numberOfItems) && action==false}
        <button
            disabled
            class="bg-slate-300 font-bold border-slate-200 border-2 buy_button rounded-xl"
        >
            Nothing to sell
        </button>
    {:else if !item.checkAddAmount(numberOfItems) && action}
        <button
            disabled
            class="bg-slate-300 font-bold border-slate-200 border-2 buy_button rounded-xl"
        >
            Nothing to add
        </button>
    {:else}
        <button
            on:click={() => (action ? buyClick() : sellClick())}
            class={`buy_button transition font-bold border-slate-200 border-2 ${
                buyable
                    ? "bg-slate-100 hover:bg-white "
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
