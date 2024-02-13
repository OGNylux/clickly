<script lang="ts">
    import type { FarmUpgrade } from "$lib/data";
    import { emojis } from "$lib/store";
    import { Lock } from "lucide-svelte";

    export let upgrade: FarmUpgrade;

    function buy(){
        if ($emojis < upgrade.nextCost(1)) return;

        emojis.decrement(upgrade.nextCost(1));
        upgrade.addItem(1);
    }

    let buyable = true;

    $ : if ($emojis < upgrade.nextCost(1) || !upgrade.checkAddAmount(1))
            buyable = false;
        else buyable = true;
</script>

<div class="grid grid-flow-col grid-cols-3 place-content-start bg-amber-800 w-96 rounded-xl text-white shadow_top">
    <div class="flex flex-col justify-between p-2 col-span-2">
        <p class="font-bold">{upgrade.name}</p>
        {#if upgrade.checkAddAmount(1)}
            <p>{upgrade.nextCost(1)}</p>
        {:else}
            <p>maxxed out</p>
        {/if}
    </div>
    <div class="w-full bg-amber-900 border-2 border-amber-800 rounded-xl flex items-center relative">
        <span class="text-xl w-10 grid place-content-center">x {upgrade.getAmount()}</span>
        <button
            on:click={() => buy()}
            disabled={!buyable}
            class={`absolute top-0 right-0 h-full left-10 inset-0 buy_button transition font-bold border-amber-800 border-l-2 flex justify-center items-center 
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