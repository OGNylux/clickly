<script lang="ts">
    import { unlockedClicker, unlockedPassiveItems } from "$lib/store";
    import Building from "./Building.svelte";
</script>

<div class="flex flex-col gap-2">
    <Building storeItem={$unlockedClicker} />
    {#each $unlockedPassiveItems as item}
        <Building storeItem={item} />
    {/each}
</div>