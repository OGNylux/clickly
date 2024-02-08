<script lang="ts">
    import { unlockedPassiveItems } from "$lib/store";
    import Building from "./Building.svelte";
</script>

<div class="flex flex-col gap-2">
    {#each $unlockedPassiveItems as item}
        <Building storeItem={item} />
    {/each}
</div>