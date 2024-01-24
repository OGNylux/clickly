<script lang="js">
    import { emojis } from "$lib/store";

    function incrementCount() {
        emojis.increment(5);
    }

</script>


<main class="w-full h-screen flex justify-center items-center"> 
    <button on:click={incrementCount} class="transform active:scale-75 transition-transform">
        <img src="https://em-content.zobj.net/source/twitter/376/eggplant_1f346.png" alt="">
    </button>
    <p>Counter: {$emojis}</p>
</main>
