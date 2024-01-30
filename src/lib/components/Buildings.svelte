<script>
    import { storeItems } from "$lib/data";
    import { buildings } from "$lib/store";
    import Emoji from "./Emoji.svelte";

</script>
<div>
    {#each storeItems as storeItem, i}
        <div class="flex">
            <Emoji emoji={storeItem.component} animated={true}/>
            <!-- <img src={storeItem.image.src} alt={storeItem.image.alt}> -->
            <p class="text-5xl">{$buildings[i]}</p>
        </div>
    {/each}
</div>