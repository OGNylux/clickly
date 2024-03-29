<script lang="ts">
    import { getLevel, getLevelupScore, loadScore, unlockAllunlockedItems, unlockLevelUpReward } from "$lib/helper";
    import { emojis, isClassic, score, unlockedClicker, unlockedPassiveItems } from "$lib/store";
    import { beforeUpdate, onDestroy, onMount } from "svelte";
    import { tweened } from "svelte/motion";
    import { cubicOut } from "svelte/easing";
    import { Info } from "lucide-svelte";
    import ClickerCanvas from "$lib/components/clicker/ClickerCanvas.svelte";
    import ClickerCounter from "$lib/components/clicker/ClickerCounter.svelte";
    import { Tooltip } from "bits-ui";
    import { flyAndScale } from "$lib/transition";
    import { formatNumber } from "$lib/formatNumber";
  
    const fillPercent = tweened(0, {
        duration: 400,
        easing: cubicOut,
    });

    let currentLevel = 0,
        nextLevelScore = 1,
        currentLevelScore = 0,
        width = 0,
        passiveIncome = 0,
        interval = 0,
        mounted = false;

    function incrementCount() {
        const value = 1 + $unlockedClicker.getInfluence();
        emojis.increment(value);
        score.increment(value);
    }

    unlockedPassiveItems.subscribe((items) => {
        let tmpPassiveIncome = 0;
        items.forEach((item, i) => {
            tmpPassiveIncome = tmpPassiveIncome + item.getInfluence();
        });
        passiveIncome = tmpPassiveIncome;
    });

    onMount(() => {
        if ($isClassic){
            const level = getLevel(loadScore());
            unlockAllunlockedItems(level);
            currentLevel = level;
        } else {
            currentLevel = getLevel($score);
        }
        currentLevelScore = getLevelupScore(currentLevel);
        nextLevelScore = getLevelupScore(currentLevel + 1);

        interval = setInterval(() => {
            emojis.increment(passiveIncome);
            score.increment(passiveIncome);
        }, 1000);

        mounted = true;
    });

    onDestroy(() => {
        clearInterval(interval);
    });

    beforeUpdate(() => {
        // because beforeUpdate is even called before onMount and the data is not yet loaded
        if (!mounted) return;

        if ($score >= nextLevelScore) {
            currentLevel++;
            unlockLevelUpReward(currentLevel);
            currentLevelScore = nextLevelScore;
            nextLevelScore = getLevelupScore(currentLevel + 1);
        }
        fillPercent.set(
            $score ? (100 * ($score - currentLevelScore)) / (nextLevelScore - currentLevelScore) : 0,
        );
    });
</script>

<div
    class="bg-slate-100 border-2 h-full border-slate-200 rounded-xl flex flex-col items-center gap-2 mb-2"
    bind:offsetWidth={width}
>
    <Tooltip.Root openDelay={200}>
        <Tooltip.Trigger> 
            <h1 class="text-5xl font-bold flex items-center gap-2 p-2">
                <ClickerCounter bind:value={$emojis} />
                <img src="emojis/e.svg" alt="E" class="size-8" />
            </h1>
        </Tooltip.Trigger>
        <Tooltip.Content
            transition={flyAndScale}
            transitionConfig={{ y: 8, duration: 150 }}
            sideOffset={-5}
            side={'bottom'}
            class="z-20 text-white">
            <div class="bg-slate-800">
                <Tooltip.Arrow class="rounded-[2px] border-l border-t border-slate-950" />
            </div>
            <div class="flex flex-col text-center border-slate-950 bg-slate-800 p-2 font-medium shadow-2xl outline-none rounded-xl max-w-[1024px] overflow-hidden">
                <p class="truncate"><span title={$emojis.toLocaleString("de-DE")} class="text-yellow-400 truncate">{$emojis.toLocaleString("de-DE")}</span> E</p>
                <p>Passive Income: <span class="text-yellow-400">{formatNumber(passiveIncome)}</span> E/s</p>
            </div>
        </Tooltip.Content>  
    </Tooltip.Root>
    <div class="w-2/3 flex flex-col justify-center">
        <div class="rounded-xl bg-slate-400 w-full h-5 overflow-hidden shadow-xl">
            <div style={`width:${$fillPercent}%`} class="bg-yellow-400 h-full rounded-xl"></div>
        </div>
        <div class="grid grid-cols-3 g">
            <span>{formatNumber(getLevelupScore(currentLevel))}</span>
            <Tooltip.Root openDelay={200}>
                <Tooltip.Trigger> 
                    <p class="place-content-center flex items-center">
                        <Info size="15" />
                        <span>LVL {formatNumber(currentLevel)}</span>
                    </p>
                </Tooltip.Trigger>
                <Tooltip.Content
                    transition={flyAndScale}
                    transitionConfig={{ y: 8, duration: 150 }}
                    sideOffset={-5}
                    side={'bottom'}
                    class="z-20 text-white">
                    <div class="bg-slate-800">
                        <Tooltip.Arrow class="rounded-[2px] border-l border-t border-slate-950" />
                    </div>
                    <div class="text-center border-slate-950 bg-slate-800 p-2 font-medium shadow-2xl outline-none rounded-xl">
                        <p>Current Score: <span class="text-yellow-400">{formatNumber($score)}</span></p>
                    </div>
                </Tooltip.Content>  
            </Tooltip.Root>
            <span class="justify-self-end">{formatNumber(nextLevelScore)}</span>
        </div>
    </div>
    <div class="grid place-items-center h-full w-full z-10">
        <button
            on:click={incrementCount}
            class="transform active:scale-75 transition-transform select-none"
        >
            <img src="emojis/heart.svg" alt="clicker" class="filter drop-shadow-2xl h-ficken" />
        </button>
    </div>
    <ClickerCanvas bind:width />
</div>

<style>
    /* 
    This calculates the height of the main div divided by two. to get the height of the clicker component. 
    Then subtract 10rem, which is the height of the other clicker content.
    This Works!
    */
    .h-ficken{
        height: max(min(calc(calc(100vh - 4.25rem) / 2 - 10rem), calc(100vw - 48rem - 5rem)), 5rem);
    }
</style>