<script lang="ts">
    import { unlocked } from "$lib/store";
    import ShopItem from "./ShopItem.svelte";
</script>

<div class="flex flex-col gap-2">
    {#each $unlocked as item}
        <div class="flex items-center gap-2">
            <ShopItem storeItem={item} />
        </div>
    {/each}
</div>