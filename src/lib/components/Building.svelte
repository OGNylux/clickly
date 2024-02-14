<script lang="ts">
    import { ClickerItem, StoreItem } from "$lib/data";
    import { ArrowBigUpDash } from "lucide-svelte";
    import { crops } from "$lib/store";
    import Emoji from "./Emoji.svelte";
    import { formatNumber } from "$lib/helper";
    import { Separator } from "bits-ui";
    import { animate, spring } from "motion";

    export let storeItem: StoreItem;
    let marketValue: number;
    
    $: marketValue = storeItem.nextUpgradeCost();

    let upgrade: HTMLElement | null = null;
    
    function upgradeClick() {
        addHTMLClass();
        if($crops < storeItem.nextUpgradeCost()) return;
        
        crops.decrement(marketValue);
        storeItem.addUpgrade();
    }

    function addHTMLClass() {
        upgrade?.classList.add('upgrade');
        setTimeout(() => {
            upgrade?.classList.remove('upgrade');
        }, 100);
        animate(".upgrade", { y: [-10, 0] }, { easing: spring() });
    }
</script>   


{#if storeItem.getAmount() == 0}
    <div class="flex justify-center items-center w-96 h-[66px] bg-slate-200 rounded-xl">
        <span class="font-bold text-4xl">???</span>
    </div>
{:else}
    <div class="flex bg-slate-200 z-10 rounded-xl w-96">
        <div class="m-2 mt-1 w-full">
            <p class="font-bold">{storeItem.name}</p>
            <div class="flex h-8 -space-x-4 rtl:space-x-reverse">
                {#each {length: Math.min(storeItem.getAmount(), 10)} as _}
                    {#if storeItem.component}
                        <Emoji emoji={storeItem.component} animated={true} />
                    {:else}
                        <img src={storeItem.image.src} alt="" class="filter drop-shadow size-8">
                    {/if}
                {/each}
            </div>
        </div>
        <div class="flex relative text-white">
            <button 
            on:click={()=> upgradeClick()} class="flex absolute right-0 w-40 h-full rounded-xl overflow-hidden bg-slate-500 border-slate-200 border-2 box_transition hover:w-96 active:bg-slate-400">
                <div bind:this={upgrade} class="flex my-auto ml-1">
                    <ArrowBigUpDash size={40}/>
                </div>
                <Separator.Root orientation="vertical" class="mx-1 my-auto h-10 rounded-xl w-0.5 bg-slate-200" />
                <div class="flex flex-col my-auto text-left ml-1">
                    {#if storeItem instanceof ClickerItem}
                        <p class="font-bold truncate">{storeItem.name}: 2x E/c</p>
                    {:else}
                        <p class="font-bold truncate">{storeItem.name}: 2x E/s</p>
                    {/if}
                    <p class="truncate text-center">{formatNumber(marketValue)} Crops</p>
                </div>
            </button>
            <div class="absolute rounded-xl w-28 right-0 h-full text-center p-2 border-2 bg-slate-600">
                <p class="text-4xl truncate">{storeItem.getAmount()}</p>
                {#if storeItem instanceof ClickerItem}
                    <p class="text-sm truncate -m-2">{storeItem.getInfluence()+1} E/c</p>
                {:else}
                    <p class="text-sm truncate -m-2">{storeItem.getInfluence()} E/s</p>
                {/if}
            </div>
        </div>
    </div>
{/if}

<style>
    .box_transition {
        transition: width 0.33s ease-in-out;
    }
</style>