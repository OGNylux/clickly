<script lang="ts">
    import type { Event, EventResult } from "$lib/api";
    import { flyAndScale } from "$lib/transition";
    import { Dialog, Separator } from "bits-ui";
    import { X } from "lucide-svelte";
    import { space } from "postcss/lib/list";

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
        resultOpen = true;
    } else {
        resultOpen = false;
    }
    async function loadEventComponent() {
        // @ts-ignore
        Event = (await import(`./events/${activeEvent.component}.svelte`)).default;
    }

    function getLeaderboardPosition() {
        return eventResult?.leaderboard.slice(3);
    }
</script>

<Dialog.Root bind:open={resultOpen} onOutsideClick={() => {eventResult = null}}>
    <Dialog.Portal>
        <Dialog.Overlay class="fixed inset-0 z-50 bg-black/80" />
        <Dialog.Content 
            transition={flyAndScale} 
            class="fixed left-[50%] top-[50%] z-50 w-full max-w-[1000px] translate-x-[-50%] translate-y-[-50%] bg-slate-100 p-5 rounded-xl"
            style="aspect-ratio: 14/7;"
        >
            {#if eventResult != null}
            <div class="flex justify-between">
                <Dialog.Title class="text-xl">
                    Event-Ergebnisse
                </Dialog.Title>
                <Dialog.Close on:click={() => {eventResult = null}}>
                    <X size={20} />
                </Dialog.Close>
            </div>
            <Separator.Root class="my-5 h-px w-full bg-slate-400"/>
            <div class="w-full">
                <h1 class="text-5xl font-extrabold text-center my-5">
                    Du bist <span class="text-amber-300">{eventResult.place}.</span> geworden!
                </h1>
                <div class="grid grid-flow-col gap-2">
                    {#if eventResult.leaderboard.length >= 2}
                        <section class="self-end">
                            <h2 class="text-xl font-bold text-center">{eventResult.leaderboard[1].username}</h2>
                            <div class="w-full bg-slate-600 h-28 text-white grid place-content-center">{eventResult.leaderboard[1].score}</div>
                        </section>
                    {/if}
                    {#if eventResult.leaderboard.length >= 1}
                        <section class="self-end">
                            <h2 class="text-xl font-bold text-center">{eventResult.leaderboard[0].username}</h2>
                            <div class="w-full bg-slate-800 h-48 text-white grid place-content-center">{eventResult.leaderboard[0].score}</div>
                        </section>
                    {/if}
                    {#if eventResult.leaderboard.length >= 3}
                        <section class="self-end">
                            <h2 class="text-xl font-bold text-center">{eventResult.leaderboard[2].username}</h2>
                            <div class="w-full bg-slate-400 h-16 text-white grid place-content-center">{eventResult.leaderboard[2].score}</div>
                        </section>
                    {/if}
                </div>
                {#each getLeaderboardPosition() ?? [] as player, i}
                    <div class="flex justify-between">
                        <p>{i+4}.</p>
                        <p>{player.username}</p>
                        <p>{player.score}</p>
                    </div>
                {/each}
            </div>
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