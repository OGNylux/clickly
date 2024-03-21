<script lang="ts">
    import Shop from '$lib/components/shop/Shop.svelte';
    import Buildings from '$lib/components/buildings/BuildingsWrapper.svelte';
    import Clicker from '$lib/components/clicker/Clicker.svelte';
    import { onMount } from 'svelte';
    import { loadLocalStorage, save } from '$lib/save';
    import Farm from '$lib/components/farm/Farm.svelte';
    import Header from '$lib/components/Header.svelte';

    onMount(() => {
        loadLocalStorage();
        save();
    });
</script>

<nav class="w-full h-16">
    <Header/>
</nav>
<main class="flex justify-around gap-2 screen">
    <Buildings />
    <div id="main" class="screen w-full xl:w-[calc(100vw - 48rem)] grid grid-rows-2">
        <Clicker />
        <Farm />
    </div>
    <Shop />
</main>

<style lang="postcss">
    .screen {
        height: calc(100vh - 4.25rem);
    }
</style>