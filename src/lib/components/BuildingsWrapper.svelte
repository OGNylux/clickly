<script lang="ts">
    import { storeItems } from "$lib/data";
    import Building from "./Building.svelte";
</script>

<div class="flex flex-col gap-2">
    {#each storeItems as storeItem}
        <Building storeItem={storeItem} />
    {/each}
</div>