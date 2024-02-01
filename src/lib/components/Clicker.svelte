<script lang="ts">
    import { formatNumber } from '$lib/helper';
    import { emojis, score, buildings } from '$lib/store';
    import { onMount } from 'svelte';
    import ClickerCanvas from '$lib/components/ClickerCanvas.svelte';

    let currentLevel = 0,
        nextLevelScore = 0,
        currentLevelScore = 0,
        width = 0;

    function incrementCount() {
        const value = 1 + $buildings[0];
        emojis.increment(value);
        score.increment(value);
    }

    function getLevelupScore(level: number) {
        if (level === 0) return 0;

        return Math.pow(10, level + 3);
    }

    function getLevel(score: number) {
        if (score === 0) {
            return 0;
        } else {
            return Math.floor(Math.log10(score) / 4);
        }
    }

    onMount(() => {
        currentLevel = getLevel($score);
        currentLevelScore = getLevelupScore(currentLevel);
        nextLevelScore = getLevelupScore(currentLevel + 1);
    });

    $ : if ($score >= nextLevelScore) {
            currentLevel++;
            currentLevelScore = nextLevelScore;
            nextLevelScore = getLevelupScore(currentLevel + 1);
        }
    
    $: fillPercent = $score ? (100 * ($score - currentLevel)) / (nextLevelScore - currentLevel) : 0;
</script>

<div class="bg-slate-200 rounded-xl grid place-content-center justify-items-center gap-2" id="clicker" bind:offsetWidth={width}>
    <h1 class="text-5xl font-bold flex items-center gap-2 p-2">
        <span>{formatNumber($emojis)}</span>
        <img src="emojis/e.svg" alt="E" class="size-8">
    </h1>
    <div class="w-2/3 flex flex-col justify-center">
        <div class="rounded-xl bg-slate-400 w-full h-5 overflow-hidden">
            <div style={`width:${fillPercent}%`} class="bg-yellow-400 h-full rounded-xl"></div>
            <!-- <progress max={nextLevelScore - getLevelupScore(currentLevel)} value={$score}></progress> -->
        </div>
        <div class="flex justify-between">
            <span>{formatNumber(getLevelupScore(currentLevel))}</span>
            <p>LVL {currentLevel}</p>
            <span>{formatNumber(nextLevelScore)}</span>
        </div>
    </div>
    <button on:click={incrementCount} class="transform active:scale-75 transition-transform ">
        <img src="emojis/heart.svg" alt="" class="size-80 p-2">
    </button>
    <ClickerCanvas bind:width />
</div>

<style lang="postcss">
    progress[value] {
        @apply border-none appearance-none shadow w-full;
    }
    progress::-webkit-progress-bar {
        background: theme('colors.slate.400');
        /* @apply rounded-xl; */
    }
    progress::-webkit-progress-value {
        background: theme('colors.yellow.400');
    }
    progress::-moz-progress-bar {
        background: theme('colors.yellow.400');
        @apply rounded-xl;
    }
    #clicker {
        /* because a custom tailwind class does not work, this is the workaround. */ 
        width: calc(100% - 40rem); 
    }
</style>