<script lang="ts">
    import type { eventTypes } from "$lib/api";
    import { onMount } from "svelte";

    export let activeEvent: string;

    console.log(activeEvent);
    

    let Event: any;

    onMount(async() => {
        Event = (await import(`./${activeEvent}`)).default;
    });
</script>

<div class="fixed inset-0 grid place-content-center">
    <svelte:component this={Event} class=""/>
</div>