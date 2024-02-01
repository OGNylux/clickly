<script lang="ts">
    import Shop from '$lib/components/Shop.svelte';
    import Buildings from '$lib/components/BuildingsWrapper.svelte';
    import Clicker from '$lib/components/Clicker.svelte';
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
