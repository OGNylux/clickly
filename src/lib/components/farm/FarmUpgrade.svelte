<script lang="ts">
    import type { FarmUpgrade } from "$lib/data";
    import { formatNumber } from "$lib/formatNumber";
    import { emojis } from "$lib/store";
    import { Lock } from "lucide-svelte";

    export let upgrade: FarmUpgrade;

    function buy(){
        if ($emojis < upgrade.nextCost(1)) return;

        emojis.decrement(upgrade.nextCost(1));
        upgrade.addItem(1);
    }

    let buyable = true;

    $ : if ($emojis < upgrade.nextCost(1) || !upgrade.checkAddAmount(1)) buyable = false;
        else buyable = true;
</script>

<div class="h-16 flex justify-between bg-amber-800 w-96 rounded-xl text-white shadow_top z-10">
    <div class="flex flex-col justify-between p-2">
        <p class="font-bold truncate">{upgrade.name}</p>
        {#if upgrade.checkAddAmount(1)}
            <p class="truncate" title={formatNumber(upgrade.nextCost(1))}>{formatNumber(upgrade.nextCost(1))} E</p>
        {:else}
            <Lock size={16} />
        {/if}
    </div>
    <div class="w-32 h-16 bg-amber-900 border-2 border-amber-800 rounded-xl flex items-center relative">
        <span class="text-xl pl-3">x {upgrade.getAmount()}</span>
        <button
            on:click={() => buy()}
            disabled={!buyable}
            class={`h-full absolute top-0 w-20 right-0 buy_button transition font-bold border-amber-800 border-l-2 flex justify-center items-center 
                ${buyable ? "bg-amber-950 hover:bg-amber-900 " : "bg-amber-900"}`}>
            {#if upgrade.checkAddAmount(1)}
                BUY
            {:else}
                <Lock size={32} />
            {/if}
        </button>
    </div>
</div>

<style>
    .buy_button {
        border-radius: 0px 12px 12px 0px;
    }
    .shadow_top{
        box-shadow: 0px -1px 10px 1px rgba(0,0,0,0.2);
    }
</style>