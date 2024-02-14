<script lang="ts">
    import Shop from '$lib/components/shop/Shop.svelte';
    import Buildings from '$lib/components/BuildingsWrapper.svelte';
    import Clicker from '$lib/components/clicker/Clicker.svelte';
    import { onMount } from 'svelte';
    import { loadLocalStorage, save } from '$lib/save';
    import { getLevel, loadScore, unlockAllunlockedItems } from '$lib/helper';
    import { score } from '$lib/store';
    import Farm from '$lib/components/farm/Farm.svelte';

    onMount(() => {
        unlockAllunlockedItems(getLevel(loadScore()));
        loadLocalStorage();
        save();
    });
</script>

<div class="w-full h-screen"> 
    <nav class="w-screen h-16">
        <p>Rank: deine Mudda</p>
    </nav>
    <main class="flex justify-around gap-2">
        <Buildings />
        <div id="main">
            <Clicker />
            <Farm />
        </div>
        <Shop />
    </main>
</div>

<style lang="postcss">
    #main {
        /*  
            because a custom tailwind class does not work, this is the workaround. 
            IMPORTANT: when the width of the the buildings or shop changes, this value has to be adjusted.
            (w-80 * 2 = 20rem * 2)
        */ 
        width: calc(100vw - 48rem); 
    }
</style>