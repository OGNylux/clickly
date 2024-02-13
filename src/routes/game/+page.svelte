<script lang="ts">
    import Shop from '$lib/components/shop/Shop.svelte';
    import Buildings from '$lib/components/BuildingsWrapper.svelte';
    import Clicker from '$lib/components/clicker/Clicker.svelte';
    import { onMount } from 'svelte';
    import { loadLocalStorage, save } from '$lib/save';
    import { getLevel, unlockAllunlockedItems } from '$lib/helper';
    import { score } from '$lib/store';

    onMount(() => {
        unlockAllunlockedItems(getLevel($score));
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
        <Clicker />
        <Shop />
    </main>
</div>
