<script lang="ts">
    import { onMount } from "svelte";

    export let animated = false;
    export let emoji: String;
    export let size = 48;
 
    let Emote: any;

    onMount(async() => {
        Emote = (await import(`./emojis/${emoji}.svelte`)).default;
    });
</script>

<svelte:component this={Emote} animated={animated} size={size}/>