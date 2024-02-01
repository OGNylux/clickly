<script lang="ts">
    import { formatNumber } from '$lib/helper';
    import { emojis, score } from '$lib/store';
    import { onMount } from 'svelte';
    import { get } from 'svelte/store';

    let progressValue = 6,
        currentLevel = 0,
        nextLevelScore = 0;

    function incrementCount() {
        emojis.increment(1);
        score.increment(1);
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
        nextLevelScore = getLevelupScore(currentLevel + 1);
    });

    $ : if ($score >= nextLevelScore) {
            currentLevel++;
            nextLevelScore = getLevelupScore(currentLevel + 1);
        }
</script>

<div class="w-full bg-slate-200 rounded-xl grid place-content-center justify-items-center gap-2">
    <h1 class="text-5xl font-bold flex items-center gap-2 p-2">
        <span>{formatNumber($emojis)}</span>
        <img src="emojis/e.svg" alt="E" class="size-8">
    </h1>
    <div>
        <progress max={nextLevelScore} value={$score}></progress>
        <div class="flex justify-between">
            <span>{formatNumber(getLevelupScore(currentLevel))}</span>
            <p>LVL {currentLevel}</p>
            <span>{formatNumber(nextLevelScore)}</span>
        </div>
    </div>
    <button on:click={incrementCount} class="transform active:scale-75 transition-transform ">
        <img src="emojis/heart.svg" alt="" class="size-80 p-2">
    </button>
</div>

<style lang="postcss">
    progress[value] {
        @apply border-none appearance-none rounded-xl shadow;
        width: 40rem;
    }
    progress[value]::-webkit-progress-bar {
        border-radius: 10em;
        background: theme('colors.slate.300');
    }
    progress[value]::-webkit-progress-value {
        border-radius: 10em;
        background: theme('colors.yellow.400');
    }
    progress[value]::-moz-progress-bar {
        border-radius: 10em;
        background: theme('colors.yellow.200');
    }
</style>