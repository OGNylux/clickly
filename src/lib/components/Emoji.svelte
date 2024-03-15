<script lang="ts">
    import { onMount } from "svelte";

    export let animated = false;
    export let emoji: String;
    export let size = 32;
 
    let Emote: any;

    onMount(async() => {
        Emote = (await import(`./emojis/${emoji}.svelte`)).default;
    });
</script>

<svelte:component this={Emote} animated={animated} size={size} class="filter drop-shadow-2xl shadow-lg"/>