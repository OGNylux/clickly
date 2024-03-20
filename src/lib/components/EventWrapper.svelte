<script lang="ts">
    import type { Event, EventResult } from "$lib/api";
    import { emojis, user } from "$lib/store";
    import { flyAndScale } from "$lib/transition";
    import { Dialog, Separator } from "bits-ui";
    import { X } from "lucide-svelte";

    export let activeEvent: Event | null = null	;
    export let eventResult: EventResult | null = null;

    let Event: any;
    let dialogOpen = false;
    let resultOpen = false;

    $: if (activeEvent != null) {
        dialogOpen = true;
        loadEventComponent();
     } else {
        dialogOpen = false;
     }

    $: if (eventResult != null) {
        getReward();
        resultOpen = true;
    } else {
        resultOpen = false;
    }
    async function loadEventComponent() {
        // @ts-ignore
        Event = (await import(`./events/${activeEvent.component}.svelte`)).default;
    }

    function getReward() {
        emojis.set(emojis.get() * getMultiplier());
    }

    function getMultiplier() {
        switch (eventResult?.place) {
            case 1:
                return 5;
            case 2:
                return 3;
            case 3:
                return 2;
            default:
                return 1;
        }
    }

    function getLeaderboardPositions() {
        return eventResult?.leaderboard.slice(3);
    }
</script>

<Dialog.Root bind:open={resultOpen} onOutsideClick={() => {eventResult = null}}>
    <Dialog.Portal>
        <Dialog.Overlay class="fixed inset-0 z-50 bg-black/80" />
        <Dialog.Content 
            transition={flyAndScale} 
            class="fixed left-[50%] top-[50%] z-50 w-full max-w-[1000px] translate-x-[-50%] translate-y-[-50%] bg-slate-100 p-5 rounded-xl border-2 border-slate-400"
            style="aspect-ratio: 14/7;"
        >
            {#if eventResult != null}
            <div class="flex justify-between">
                <Dialog.Title class="text-xl font-bold">
                    Event Summary
                </Dialog.Title>
                <Dialog.Close on:click={() => {eventResult = null}}>
                    <X size={20} />
                </Dialog.Close>
            </div>
            <Separator.Root class="my-5 h-[2px] w-full bg-slate-400"/>
            <div class="w-full">
                <h1 class="text-5xl font-extrabold text-center my-5">
                    You placed <span class="text-amber-300">{eventResult.place}.</span>!
                </h1>
                <h3 class="text-center text-xl mb-10">Reward: <span class="rainbow">{getMultiplier()}x</span> your current Emojis</h3>
                <div class="grid grid-cols-3 gap-2">
                    {#if eventResult.leaderboard.length >= 2}
                        <section class="self-end">
                            <h2 class="text-xl font-bold text-center">{eventResult.leaderboard[1].username}</h2>
                            <div class="w-full bg-slate-600 h-28 text-white grid place-content-center bar">{eventResult.leaderboard[1].score}</div>
                        </section>
                    {/if}
                    {#if eventResult.leaderboard.length >= 1}
                        <section class="self-end">
                            <h2 class="text-xl font-bold text-center">{eventResult.leaderboard[0].username}</h2>
                            <div class="w-full bg-slate-800 h-48 text-white grid place-content-center bar">{eventResult.leaderboard[0].score}</div>
                        </section>
                    {/if}
                    {#if eventResult.leaderboard.length >= 3}
                        <section class="self-end">
                            <h2 class="text-xl font-bold text-center">{eventResult.leaderboard[2].username}</h2>
                            <div class="w-full bg-slate-400 h-16 text-white grid place-content-center bar">{eventResult.leaderboard[2].score}</div>
                        </section>
                    {/if}
                </div>
            </div>
            {#if eventResult?.leaderboard.findIndex((board) => board.username === user.get()) > 3}
                {#if eventResult?.leaderboard.findIndex((board) => board.username === user.get()) > 4}
                    ...
                {/if}
                <div class="flex justify-between">
                    <p>{eventResult?.leaderboard.findIndex((board) => board.username === user.get())+1}.</p>
                    <p>{eventResult.leaderboard[(eventResult?.leaderboard.findIndex((board) => board.username === user.get()))].username}</p>
                    <p>{eventResult.leaderboard[(eventResult?.leaderboard.findIndex((board) => board.username === user.get()))].score}</p>
                </div>
            {/if}
            {/if}
        </Dialog.Content>
      </Dialog.Portal>
</Dialog.Root>

<Dialog.Root bind:open={dialogOpen} closeOnOutsideClick={false}>
    <Dialog.Portal>
        <Dialog.Overlay class="fixed inset-0 z-50 bg-black/80" />
        <Dialog.Content 
            transition={flyAndScale} 
            class="fixed left-[50%] top-[50%] z-50 translate-x-[-50%] translate-y-[-50%] bg-slate-100 p-5 rounded-xl"
            style="aspect-ratio: 14/7;"
        >
            {#if activeEvent != null}
                <Dialog.Title class="text-center text-3xl font-bold">
                    {activeEvent.name}
                </Dialog.Title>
                <Dialog.Description class="text-center ">
                    {activeEvent.description}
                </Dialog.Description>
                <svelte:component this={Event} />
            {/if}
        </Dialog.Content>
      </Dialog.Portal>
</Dialog.Root>

<style>
    .bar {
        border-radius: 12px 12px 0px 0px;
    }
    .rainbow{
		animation: rainbow 2.5s linear;
		animation-iteration-count: infinite;
    }
    @keyframes rainbow{
		100%,0%{
			color: rgb(255,0,0);
		}
		8%{
			color: rgb(255,127,0);
		}
		16%{
			color: rgb(255,255,0);
		}
		25%{
			color: rgb(127,255,0);
		}
		33%{
			color: rgb(0,255,0);
		}
		41%{
			color: rgb(0,255,127);
		}
		50%{
			color: rgb(0,255,255);
		}
		58%{
			color: rgb(0,127,255);
		}
		66%{
			color: rgb(0,0,255);
		}
		75%{
			color: rgb(127,0,255);
		}
		83%{
			color: rgb(255,0,255);
		}
		91%{
			color: rgb(255,0,127);
		}
    }

</style>