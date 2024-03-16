<script lang="ts">
    import FallingObjectManager from "$lib/components/events/FallingObjectManager.svelte";
    import { onMount } from "svelte";
    let width: number = 1000,
        height: number,
        score: number;
</script>

<div bind:offsetWidth={width} bind:offsetHeight={height} class="flex w-1/2 h-96 overflow-hidden items-center justify-center relative">
    <div class="text-black text-7xl" style="white-space: nowrap;">
        <p class="select-none absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">{score} Cookies</p>
        <p class="select-none absolute wave1 left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">{score} Cookies</p>
        <p class="select-none absolute wave2 left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">{score} Cookies</p>
    </div>
    <FallingObjectManager bind:width bind:height bind:score />
</div>







<style lang="postcss">
    .wave1 {
        color: #ffffff60;
        animation: animate 4s ease-in-out infinite;
    }
    .wave2 {
        color: #ffffff60;
        animation: animate 7s ease-in-out infinite;
    }
    
    @keyframes animate {
        0%,
        100% {
            clip-path: polygon(
                0% 45%,
                16% 44%,
                33% 50%,
                54% 60%,
                70% 61%,
                84% 59%,
                100% 52%,
                100% 100%,
                0% 100%
            );
        }
    
        50% {
            clip-path: polygon(
                0% 60%,
                15% 65%,
                34% 66%,
                51% 62%,
                67% 50%,
                84% 45%,
                100% 46%,
                100% 100%,
                0% 100%
            );
        }
    }
</style>
