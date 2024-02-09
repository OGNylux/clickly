<script lang="ts">
    import type { StoreItem } from "$lib/data";
    import { emojis } from "$lib/store";

    export let action: boolean;
    export let numberOfItems: number;
    export let item: StoreItem;

    let buyable = true

    $: if ($emojis < item.nextCost(numberOfItems)) buyable = false;
       else buyable = true;
</script>

<div class="grid grid-flow-col grid-cols-4 place-content-start bg-slate-200 w-96 rounded-xl">
    <img src={item.image.src} alt="" class="size-16 p-2 drop-shadow-xl">
    <div class="flex flex-col justify-between p-2 col-span-2">
        <p>{item.name}</p>
        <p>{item.nextCost(numberOfItems)}</p>
    </div>

    <button on:click={() => action ? item.addItem(numberOfItems) : item.removeItem(numberOfItems)} 
        class={`buy_button transition font-bold border-slate-200 border-2 ${buyable ? 'bg-slate-100 hover:bg-slate-300 ' : 'bg-slate-300 border-slate-200'}`}>
        {action ? "BUY" : "SELL"}
    </button>
</div>

<style lang="postcss">
    .buy_button {
        border-radius: 0px 12px 12px 0px;
    }
</style>