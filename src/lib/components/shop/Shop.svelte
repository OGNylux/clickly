<script lang="ts">
    import { unlockedPassiveItems } from "$lib/store";
    import ShopItem from "./ShopItem.svelte";
    import ClickerShopItem from "./ClickerShopItem.svelte";
    import { ArrowLeftFromLine, ArrowRightFromLine } from "lucide-svelte";

    let buy = true;
    let numberOfItems = 1;
    let collapsed = false;

    function toggleItems(n: number) {
        numberOfItems = n;
    }

    function toggleCollapsed() {
        const shop = document.getElementById("shop");
        if (collapsed) {
            shop?.classList.remove("right-0");
            shop?.classList.add("right-[-26rem]");
            collapsed = false;
        } else {
            shop?.classList.remove("right-[-26rem]");
            shop?.classList.add("right-0");
            collapsed = true;
        }
    }
</script>

<div id="shop" class="flex flex-col gap-2 mr-1 z-10 xl:z-0 right-[-26rem] xl:right-0 absolute xl:relative transition-all">
    <button class="block absolute -left-14 bg-slate-800 text-white p-5 button1 xl:hidden z-10" on:click={() => toggleCollapsed()}>
        {#if collapsed}
            <ArrowRightFromLine size={20} />
        {:else}
            <ArrowLeftFromLine size={20} />
        {/if}
    </button>
    <div class="border-slate-100 border-2 h-full bg-slate-50 rounded-xl p-2 overflow-y-auto">
        <div class="grid grid-flow-col grid-cols-1 sticky">
            <div class="grid grid-cols-2 w-28 font-medium border-slate-200 border-2 rounded-xl">
                <button on:click={() => (buy = true)} class={`button1 ${buy ? "bg-slate-100" : "bg-slate-300"}`}>Buy</button>
                <button on:click={() => (buy = false)} class={`button2 ${!buy ? "bg-slate-100" : "bg-slate-300"}`}>Sell</button>
            </div>
            <div class="grid grid-cols-3 w-36 font-medium border-slate-200 border-2 rounded-xl">
                <button on:click={() => toggleItems(1)} class={`button1 ${numberOfItems == 1 ? "bg-slate-100" : "bg-slate-300"}`}>1</button>
                <button on:click={() => toggleItems(10)} class={`${numberOfItems == 10 ? "bg-slate-100" : "bg-slate-300"}`}>10</button>
                <button on:click={() => toggleItems(100)} class={`button2 ${numberOfItems == 100 ? "bg-slate-100" : "bg-slate-300"}`}>100</button>
            </div>
        </div>
        <div class="flex flex-col gap-2 items-center py-1">
            <ClickerShopItem bind:action={buy} bind:numberOfItems />
            {#each $unlockedPassiveItems as _,i}
                <ShopItem bind:action={buy} bind:numberOfItems itemIndex={i} />
            {/each}
        </div>
    </div>
</div>

<style>
    .button1 {
        border-radius: 10px 0px 0px 10px;
    }
    .button2 {
        border-radius: 0px 10px 10px 0px;
    }
</style>
