<script lang="ts">
    import type { StoreItem } from "$lib/data";
    import { emojis, unlockedClicker } from "$lib/store";

    export let action: boolean;
    export let numberOfItems: number;
    export let item: StoreItem;

    let buyable = true

    // lass das mit dem max einfach in der buy function handeln in der klasse.
    // Ja natürlich sowieso, aber dann sollte es aauch nicht mehr buyable sein von der View aus lol
    //hier fehlt das handln der maximalen Anzahl an upgrades, deswegen würde ich doch dedizierte methoden machen und nicht direkt buy im html aufrufen
    // und einfach ein getter wenn man den state im design anzeigen will Verstehe ich nicht
    $: if ($emojis < $unlockedClicker.nextCost(numberOfItems)) buyable = false;
       else buyable = true;
</script>

<div class="grid grid-flow-col grid-cols-4 place-content-start bg-slate-200 w-96 rounded-xl">
    <img src={item.image.src} alt="" class="size-16 p-2 drop-shadow-xl">
    <div class="flex flex-col justify-between p-2 col-span-2">
        <p>{$unlockedClicker.name}</p>
        <p>{$unlockedClicker.nextCost(numberOfItems)}</p>
    </div>

    <button on:click={() => action ? item.buy(numberOfItems) : item.sell(numberOfItems)} 
        class={`buy_button transition font-bold border-slate-200 border-2 ${buyable ? 'bg-slate-100 hover:bg-slate-300 ' : 'bg-slate-300 border-slate-200'}`}>
        {action ? "BUY" : "SELL"}
    </button>
</div>

<style lang="postcss">
    .buy_button {
        border-radius: 0px 12px 12px 0px;
    }
</style>