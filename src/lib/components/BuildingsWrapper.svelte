<script lang="ts">
    import { unlockedClicker } from "$lib/store";
    import Building from "./Building.svelte";
</script>

<div class="flex flex-col gap-2">
    {#each $unlockedClicker as item}
        <Building storeItem={item} />
    {/each}
</div>