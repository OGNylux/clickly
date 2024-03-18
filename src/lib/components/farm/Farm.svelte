<script lang="ts">
    import FarmObjekt from "$lib/components/farm/FarmObject.svelte";
    import FarmUpgrade from "$lib/components/farm/FarmUpgrade.svelte";
    import { crops, farmUpgrades, isSoundOn, score } from "$lib/store";
    import { onMount } from 'svelte';
    import { tweened } from "svelte/motion";
    import { sineInOut } from "svelte/easing";
    import { animate, timeline } from "motion";
    import { formatNumber } from "$lib/formatNumber";
    import { getLevel } from "$lib/helper";

    let audio: HTMLAudioElement,
        volume = tweened(0, { duration: 750, easing: sineInOut }),
        squirrel = false,
        m = { x: 0, y: 0 },
	    container: HTMLDivElement,
        interval: number;

    onMount(() => {
        audio = new Audio('/farm/ambience.mp3');
        audio.loop = true;
        startRandomSquirrel();
    });

    function startRandomSquirrel() {
        const min = 60 * 1000; 
        const max = 200 * 1000;
        
        interval = setInterval(() => {
            squirrel = true;
            timeline([
            ["#squirrel", {x: -70, y: 20, zIndex: 0}, { duration: 0.8 }],
            ["#squirrel", {x: -100, y: 170, zIndex: 10}, { duration: 0.6 }],
            ["#squirrel", {x: 200, y: 130, zIndex: 10}, { duration: 0.9 }],
            ["#squirrel", {x: 200, y: 50, zIndex: 0}, { duration: 0.5 }],
            ]).finished.then(() => {
                squirrel = false;
                animate("#squirrel", {x: 0, y: 0}, { duration: 0 });
            });
        }, Math.floor(Math.random() * (max - min + 1) + min));
    }

	function handleMousemove(e: any) {
        let rect = (document.getElementById('farm') as HTMLElement).getBoundingClientRect();
        m.x = (e.clientX - rect.left)-20;
        m.y = (e.clientY - rect.top)-20;
	}

    function stopRandomSquirrel() {
        clearInterval(interval);
    }
    
    function randomIntFromInterval(min: number, max: number) { // min and max included 
        return Math.floor(Math.random() * (max - min + 1) + min)
    }

    function squirrelReward() {
        const randomReward = randomIntFromInterval(10, 20) * (getLevel($score) > 0 ? getLevel($score)*100 : 1);

		const rewardLabel = document.createElement('span');
		rewardLabel.textContent = `+${randomReward} C`;
        rewardLabel.classList.add('absolute', 'z-10', 'text-md', 'text-amber-300', 'font-bold');
        rewardLabel.style.left = m.x+'px';
        rewardLabel.style.top = m.y+'px';
		container.appendChild(rewardLabel);

        animate(rewardLabel, {opacity: 0, y: 25}, {duration: 3}).finished.then(() => {
            container.removeChild(rewardLabel);
        });
        crops.increment(randomReward);
    }

    $ : if (audio) {
            audio.volume = $volume / 100
            if ($volume == 0 || !isSoundOn.get()) audio.pause();
        }
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<div bind:this={container}
    class="w-full h-full rounded-xl border-2 border-slate-200 relative grid place-content-center select-none overflow-hidden" 
    id="farm" 
    on:mousemove={handleMousemove}
    on:mouseenter={() => { if(isSoundOn.get()) volume.set(100); audio.play(); }} 
    on:mouseleave={() => volume.set(0)}>
    <div class="grid grid-cols-4 grid-rows-2 place-content-center gap-4">
        {#each { length: $farmUpgrades[0].getAmount() + 1} as _}
            <FarmObjekt />
        {/each}
    </div>
    <div class="absolute bottom-0 left-0 w-full flex flex-col items-center xl:flex-row xl:justify-between p-2 gap-2">
        {#each $farmUpgrades as upgrade}
            <FarmUpgrade upgrade={upgrade} />
        {/each}
    </div>
    <div class="absolute grid place-content-center inset-0 z-[1]">
        <svg width="489" height="269" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path class="fill-amber-800" d="M9.408 98.621a12 12 0 0 1 1.354-4.373L57.694 6.7A12 12 0 0 1 70.418.564l180.734 32.882c1.279.232 2.588.256 3.875.068l169.23-24.62a12 12 0 0 1 13.28 8.628l25.789 91.75c.225.803.534 1.58.921 2.319l23.308 44.526a12 12 0 0 1-2.854 14.704l-101.772 86.62a11.998 11.998 0 0 1-6.886 2.828L258.88 269l-181.39-8.793a12 12 0 0 1-8.017-3.615L3.942 189.278a12 12 0 0 1-3.332-9.667l8.798-80.99Z" fill="#D9D9D9"/>
        </svg>
    </div>
    <div class="absolute top-0 left-0 w-full flex justify-center mt-2">
        <div class="bg-[#0000005d] text-white py-2 px-6 w-fit rounded-xl text-3xl text-center z-10 flex items-center">
            <h2>{formatNumber($crops)}</h2>
            <img src="emojis/c.svg" alt="c" class="size-6 ml-1">
        </div>
    </div>
    <button 
        class={`absolute hidden ${squirrel ? '4xl:block' : '4xl:hidden'}`} 
        id="squirrel"
        on:click={() => squirrelReward()}>
        <img src="/farm/squirrel.svg" alt="Squirrel" >
    </button>
    <div class="absolute right-0 top-2 hidden 4xl:block">
        <img src="/farm/pig_bg.svg" alt="Tree" class="h-3/4 mr-2">
    </div>
    <div class="absolute right-0 bottom-20 hidden 3xl:block">
        <img src="/farm/tractor.svg" alt="Tractor" class="h-3/4 mr-2">
    </div>
    <div class="absolute -left-8 -top-10 hidden 4xl:block">
        <img src="/farm/cow_bg.svg" alt="Tree" class="h-3/4 mr-2">
    </div>
    <div class="absolute left-0 bottom-20 hidden 3xl:block">
        <img src="/farm/hut.svg" alt="Hut" class="w-3/4 ml-2">
    </div>
</div>

<style lang="postcss">
    #farm {
        background: url('/grass.svg') repeat;
    }
    #squirrel {
        right: 250px;
        top: 90px;
        pointer-events: all !important;
    }
</style>