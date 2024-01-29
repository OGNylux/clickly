<script>
    import { emojis, isOnline } from "$lib/store";

    function incrementCount() {
        emojis.increment(5);
    }

</script>


<main class="w-full h-screen flex justify-center items-center"> 
    <button on:click={incrementCount} class="transform active:scale-75 transition-transform ">
        <img src="emojis/moai.svg" alt="" class="size-80">
    </button>
    <div>
        <p>Counter: {$emojis}</p>
        <p>isOnline: {$isOnline}</p>
        <button on:click={() => isOnline.set(!$isOnline)}>setOnline</button>
    </div>
</main>
