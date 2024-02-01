<script lang="ts">
    import type { storeItem } from "$lib/data";
    import { buildings } from "$lib/store";
    import Emoji from "./Emoji.svelte";

    export let storeItem: storeItem;
</script>

<div class="flex w-80 bg-slate-200 rounded-xl p-2">
    <Emoji emoji={storeItem.component} animated={true}/>
    <p class="text-5xl">{$buildings[storeItem.index]}</p>
</div>