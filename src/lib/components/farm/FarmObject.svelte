<script lang="ts">
    import { tweened } from "svelte/motion";
    import { crops, farmUpgrades, unlockedFarmItems } from "$lib/store";
    import { Tooltip, Popover, Separator, Progress } from "bits-ui";
    import type { FarmItem } from "$lib/data";
    import { Plus, X } from "lucide-svelte";
    import { linear } from "svelte/easing";
    import { flyAndScale } from "$lib/transition";

    let progress = tweened(0, { duration: 420, easing: linear }),
        remainingTime: number = 0,
        farmItem: FarmItem|null = null,
        popoverOpen: boolean;

    function startProgress() {
        if (farmItem == null) return;

        const time = farmItem.growthTime * (1 - $farmUpgrades[1].getInfluence());
        progress.subscribe((value) => {
            if (farmItem == null) return;
            remainingTime = Math.ceil((1 - value / 100) * time);
        });
        progress.set(100, { duration: time });
    }

    function collect() {
        if (remainingTime == 0 && farmItem != null) {
            crops.increment(farmItem.value);
            farmItem.harvest();
            farmItem = null;
            progress.set(0);
        }
    }

    function plant(item: FarmItem) {
        if (remainingTime > 0) return;

        if (item.getAvailable() > 0){
            farmItem = item;
            farmItem.plant();
            remainingTime = item.growthTime;
            popoverOpen = false;
            startProgress();
        } 
    }

    function millisToMinutesAndSeconds(millis: number) {
        var minutes: number = Math.floor(millis / 60000);
        var seconds: number = Math.ceil((millis % 60000) / 1000);

        return minutes + ":" + (seconds < 10 ? "0" : "") + seconds;
    }
</script>

<div class="flex flex-col justify-center gap-1">
    <button on:click={collect} class="bg-amber-950 rounded-3xl transform active:scale-90 transition z-10 select-none xl:size-20 grid place-content-center gap-2">  
        <Popover.Root bind:open={popoverOpen}>
            <Popover.Trigger>
                <div class="grid items-center">
                    {#if farmItem}
                        <img src={farmItem.image.src} alt={farmItem.image.alt} class="size-16 object-contain mt-5" style={`transform: scale(${$progress}%); transform-origin: center center`} />
                    {:else}
                        <Plus class="size-10 text-amber-900" />
                    {/if}
                </div>
            </Popover.Trigger>
            <Popover.Content
                class="z-20 w-60 rounded-xl border-2 border-slate-300 bg-slate-200 p-4 shadow-2xl"
                transition={flyAndScale}
                sideOffset={20}
                side={'top'}>
                <div class="flex justify-between items-center">
                    <p>Pick a seed</p>
                    <Popover.Close><X /></Popover.Close>
                </div>
                <Separator.Root class="-mx-4 my-3 h-px bg-slate-300" />
                <div class="grid grid-cols-3 gap-2">
                    {#each $unlockedFarmItems as item}
                        <button on:click={() => plant(item)} 
                            class={`relative text-center bg-slate-300 rounded-xl size-16 p-2 ${item.getAvailable() == 0 ? 'opacity-50' : ''}`}>
                            <img src={item.image.src} alt={item.image.alt}>
                            <span class="absolute bottom-0 right-0 p-1">{item.getAvailable()}</span>
                        </button>
                    {:else}
                    <div class="grid col-span-3">
                        Nothing to find here yet... <br> Level up to get your first seed!
                    </div>
                    {/each}
                </div>
                <Popover.Arrow />
            </Popover.Content>
        </Popover.Root>
        {#if farmItem}
            <Tooltip.Root>
                <Tooltip.Trigger>
                    <Progress.Root
                        value={$progress}
                        max={100}
                        class="bg-slate-200 w-5/6 mx-auto h-2 rounded-xl overflow-hidden">
                        <div class="bg-yellow-400 rounded-xl h-full" style={`transform: translateX(-${
                            100 - (100 * ($progress ?? 0)) / (100 ?? 1)
                        }%)`}></div>
                    </Progress.Root>
                </Tooltip.Trigger>
                <Tooltip.Content
                    transition={flyAndScale}
                    transitionConfig={{ y: 8, duration: 150 }}
                    sideOffset={6}
                    side={'bottom'}
                    class="z-20">
                    <div class="bg-slate-200">
                        <Tooltip.Arrow class="rounded-[2px] border-l border-t border-slate-300" />
                    </div>
                    <div class="text-center w-20 border-slate-300 bg-slate-200 p-2 font-medium shadow-2xl outline-none rounded-xl">
                        {millisToMinutesAndSeconds(remainingTime)}
                    </div>
                </Tooltip.Content>
            </Tooltip.Root>
        {/if}
    </button>
</div>