<script lang="ts">
    import { unlocked } from "$lib/store";
    import Building from "./Building.svelte";
</script>

<div class="flex flex-col gap-2">
    {#each $unlocked as item}
        <Building storeItem={item} />
    {/each}
</div>