<script lang="ts">
    import { unlockedClicker, unlockedPassiveItems } from "$lib/store";
    import Building from "./Building.svelte";
</script>

<div class="flex flex-col gap-2">
    <p class="text-gray-500">Clicker</p>
    <Building storeItem={$unlockedClicker} />
    <p class="text-gray-500">Passive Income</p>
    {#each $unlockedPassiveItems as item}
        <Building storeItem={item} />
    {/each}
</div>
