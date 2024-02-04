<script lang="ts">
    import { storeItems } from "$lib/data";
    import ShopItem from "./ShopItem.svelte";
</script>

<div class="flex flex-col gap-2">
    {#each storeItems as storeItem}
        <div class="flex items-center gap-2">
            <ShopItem storeItem={storeItem} />
        </div>
    {/each}
</div>