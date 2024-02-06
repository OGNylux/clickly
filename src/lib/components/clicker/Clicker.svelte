<script lang="ts">
    import { formatNumber, getLevel, getLevelupScore, unlockLevelUpReward } from '$lib/helper';
    import { emojis, score, buildings, unlocked } from '$lib/store';
    import { beforeUpdate, onDestroy, onMount } from 'svelte';
    import { tweened } from 'svelte/motion';
    import { cubicOut } from 'svelte/easing';
    import { Info } from 'lucide-svelte';
    import ClickerCanvas from '$lib/components/clicker/ClickerCanvas.svelte';
    import ClickerCounter from '$lib/components/clicker/ClickerCounter.svelte';
    import Tooltip from '$lib/components/Tooltip.svelte';

    const fillPercent = tweened(0, {
        duration: 400,
        easing: cubicOut
    });

    let currentLevel = 0,
        nextLevelScore = 1,
        currentLevelScore = 0,
        width = 0,
        passiveIncome = Array(8).fill(0),
        interval = 0;

    function incrementCount() {
        const value = 1 + $buildings[0];
        emojis.increment(value);
        score.increment(value);
    }

    onMount(() => {
        currentLevel = getLevel($score);
        currentLevelScore = getLevelupScore(currentLevel);
        nextLevelScore = getLevelupScore(currentLevel + 1);

        interval = setInterval(() => {
            for (let i = 1; i < $unlocked.length; i++) {
                const income = $buildings[i] * $unlocked[i].multiplier;
                if (income == 0) continue;

                passiveIncome[i] = income;
                emojis.increment(income);
                score.increment(income);
            }
        }, 1000);
    });

    onDestroy(() => {
        clearInterval(interval);
    });

    beforeUpdate(() => {
        if ($score >= nextLevelScore) {
            currentLevel++;
            unlockLevelUpReward(currentLevel);
            currentLevelScore = nextLevelScore;
            nextLevelScore = getLevelupScore(currentLevel + 1);
        }
        fillPercent.set($score ? (100 * ($score - currentLevelScore)) / (nextLevelScore - currentLevelScore) : 0);
    });
</script>

<div class="bg-slate-100 border-2 border-slate-200 rounded-xl grid place-items-center justify-items-center gap-2" id="clicker" bind:offsetWidth={width}>
    <Tooltip>
        <h1 class="text-5xl font-bold flex items-center gap-2 p-2">
            <ClickerCounter bind:value={$emojis} />
            <img src="emojis/e.svg" alt="E" class="size-8">
        </h1>
        <div slot="tip">
            <p>dein passives Einkommen: <span class="text-yellow-400">{passiveIncome.reduce((p,a) => p+a, 0)} E/s</span></p>
        </div>
    </Tooltip>
    <div class="w-2/3 flex flex-col justify-center">
        <div class="rounded-xl bg-slate-400 w-full h-5 overflow-hidden shadow-xl">
            <div style={`width:${$fillPercent}%`} class="bg-yellow-400 h-full rounded-xl"></div>
        </div>
        <div class="grid grid-flow-col">
            <span>{formatNumber(getLevelupScore(currentLevel))}</span>
            <Tooltip>
                <p class="place-content-center flex items-center">
                    <Info size="15" />
                    <span>LVL {currentLevel}</span>
                </p>
                <div slot="tip">
                    <p>dein aktueller Score: <span class="text-yellow-400">{$score}</span></p>
                </div>
            </Tooltip>
            <span class="justify-self-end">{formatNumber(nextLevelScore)}</span>
        </div>
    </div>
    <button on:click={incrementCount} class="transform active:scale-75 transition-transform z-10 select-none">
        <img src="emojis/heart.svg" alt="" class="size-64 p-2 filter drop-shadow-2xl">
    </button>
    <ClickerCanvas bind:width />
</div>

<style lang="postcss">
    #clicker {
        /*  
            because a custom tailwind class does not work, this is the workaround. 
            IMPORTANT: when the width of the the buildings or shop changes, this value has to be adjusted.
            (20rem * 2 = w-80 * 2)
        */ 
        width: calc(100% - 48rem); 
    }
</style>