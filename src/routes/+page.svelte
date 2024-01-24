<script lang="js">
    import { emojis } from "$lib/store";

    function incrementCount() {
        emojis.increment(5);
    }

</script>


<main>
    <button on:click={incrementCount} class="animate-bounce">
        😄
    </button>
    <p>Counter: {$emojis}</p>
</main>
