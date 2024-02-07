<script lang="ts">
    import type { StoreItem } from "$lib/data";
    import { buildings } from "$lib/store";
    import Emoji from "./Emoji.svelte";

    export let storeItem: StoreItem;
</script>

<div class="grid grid-cols-3 w-80 bg-slate-200 rounded-xl p-2">
    <div class="col-span-2">
        <p>{storeItem.name}</p>
        <div class="flex">
            {#each {length: Math.min($buildings[storeItem.index], 10)} as _}
                <Emoji emoji={storeItem.component} animated={true}/>
            {/each}
        </div>
    </div>
    <p class="text-5xl">{$buildings[storeItem.index]}</p>
</div>