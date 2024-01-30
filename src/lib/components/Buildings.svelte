<script>
    import { storeItems } from "$lib/data";
    import { buildings } from "$lib/store";
</script>
<div>
    {#each storeItems as storeItem, i}
        <div class="flex">
            <img src={storeItem.image.src} alt={storeItem.image.alt}>
            <p>{$buildings[i]}</p>
        </div>
    {/each}
</div>