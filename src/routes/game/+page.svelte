<script>
    import { emojis } from '$lib/store';
    import Shop from '$lib/components/Shop.svelte';
    import Buildings from '$lib/components/Buildings.svelte';

    function incrementCount() {
        emojis.increment(5);
    }
</script>


<main class="w-full h-screen flex justify-center items-center"> 
    <Buildings />
    <div>
        <p>Counter: {$emojis}</p>
        <button on:click={incrementCount} class="transform active:scale-75 transition-transform ">
            <img src="emojis/heart.svg" alt="" class="size-80">
        </button>
    </div>
    <Shop />
</main>
