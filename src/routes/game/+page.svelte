<script lang="ts">
    import { emojis } from '$lib/store';
    import Shop from '$lib/components/Shop.svelte';
    import Buildings from '$lib/components/Buildings.svelte';

    function incrementCount() {
        emojis.increment(1);
    }
</script>


<main class="w-full h-screen grid place-content-center grid-flow-col gap-10"> 
    <Buildings />
    <div>
        <p>Counter: {$emojis}E</p>
        <button on:click={incrementCount} class="transform active:scale-75 transition-transform ">
            <img src="emojis/heart.svg" alt="" class="size-80">
        </button>
    </div>
    <Shop />
</main>
