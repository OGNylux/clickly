<script lang="ts">
    import  StoreItem  from "$lib/data";
    import Emoji from "./Emoji.svelte";

    export let storeItem: StoreItem;
</script>

<div class="flex w-96 bg-slate-200 rounded-xl p-2">
    {#if storeItem.component}
        <Emoji emoji={storeItem.component} animated={true}/>
    {:else}
        <img src={storeItem.image.src} alt="">
    {/if}
    <p class="text-5xl">{storeItem.getAmount()}</p>
</div>