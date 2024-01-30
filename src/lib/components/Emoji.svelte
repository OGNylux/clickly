<script>
    // @ts-nocheck
    import { onMount } from "svelte";

    export let animated = false;
    export let emoji;
 
    let Emote;

    onMount(async() => {
        Emote = (await import(`./emojis/${emoji}.svelte`)).default;
    });
</script>

<svelte:component this={Emote} animated={animated} />