<script lang="ts">
    import type { Event } from "$lib/api";
    import { flyAndScale } from "$lib/transition";
    import { Dialog } from "bits-ui";

    export let activeEvent: Event | null = null	;

    let Event: any;
    let dialogOpen = false;

    $: if (activeEvent != null) {
        dialogOpen = true;
        loadEventComponent();
     } else {
        dialogOpen = false;
     }

    async function loadEventComponent() {
        // @ts-ignore
        Event = (await import(`./events/${activeEvent.component}.svelte`)).default;
    }
</script>
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