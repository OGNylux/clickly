<script lang="ts">
    import type { Event } from "$lib/api";
    import { onMount } from "svelte";

    export let activeEvent: Event;

    let Event: any;

    onMount(async() => {
        Event = (await import(`./${activeEvent.component}`)).default;
    });
</script>

<div class="fixed z-40 top-0 left-0 w-full h-full grid place-content-center ">
    <div class="z-40 bg-slate-100 p-2 rounded-xl shadow-2xl" style="height: 700px; width: 1100px;">
        <svelte:component this={Event} />
    </div>
</div>