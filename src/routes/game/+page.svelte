<script lang="ts">
    import Shop from '$lib/components/shop/Shop.svelte';
    import Buildings from '$lib/components/BuildingsWrapper.svelte';
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
    <div id="main" class="screen grid grid-rows-2">
        <Clicker />
        <Farm />
    </div>
    <Shop />
</main>

<style lang="postcss">
    #main {
        /*  
            because a custom tailwind class does not work, this is the workaround. 
            IMPORTANT: when the width of the the buildings or shop changes, this value has to be adjusted.
            (w-80 * 2 = 20rem * 2)
        */ 
        width: calc(100vw - 48rem); 
    }
    .screen {
        height: calc(100vh - 4.25rem);
    }
</style>