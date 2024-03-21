<script lang="ts">
    import { unlockedClicker, unlockedPassiveItems } from "$lib/store";
    import { Separator } from "bits-ui";
    import Building from "./Building.svelte";
    import { ArrowLeftFromLine, ArrowRightFromLine } from "lucide-svelte";

    let collapsed = false;

    function toggleCollapsed() {
        const buildings = document.getElementById("buildings");
        if (collapsed) {
            buildings?.classList.remove("left-0");
            buildings?.classList.add("left-[-26rem]");
            collapsed = false;
        } else {
            buildings?.classList.remove("left-[-26rem]");
            buildings?.classList.add("left-0");
            collapsed = true;
        }
    }
</script>

<div class="flex z-10 xl:z-0 left-[-26rem] xl:left-0 absolute xl:relative transition-all" id="buildings">
    <button class="block absolute -right-14 bg-slate-800 text-white p-5 button2 xl:hidden z-10" on:click={() => toggleCollapsed()}>
        {#if collapsed}
            <ArrowLeftFromLine size={20} />
        {:else}
            <ArrowRightFromLine size={20} />
        {/if}
    </button>
    <div class="border-slate-100 border-2 ml-1 bg-slate-50 rounded-xl py-2 pl-1 pr-2.5 overflow-y-auto">
        <div class="flex flex-col gap-2 ">
            <Building storeItem={$unlockedClicker} />
            <Separator.Root class="m-1 h-1 rounded bg-slate-200" />
            {#each $unlockedPassiveItems as item}
                <Building storeItem={item} />
            {/each}
        </div>
    </div>
</div>

<style>
    .button2 {
        border-radius: 0px 10px 10px 0px;
    }
</style>
