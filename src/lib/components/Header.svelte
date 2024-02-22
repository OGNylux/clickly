<script lang="ts">
    import { onMount } from "svelte";
    import { Settings, BellDot } from "lucide-svelte";
    import { Popover, Separator } from "bits-ui";
    import { flyAndScale } from "$lib/transition";
    import { getLevel } from "$lib/helper";
    import { notifications, score } from "$lib/store";

    let level = 0;

    onMount(() => {
        level = getLevel($score);
    });
</script>

<div class="flex h-10 items-center bg-slate-200 px-3 header">
    <div class="inline-flex h-8 items-center justify-center px-2 text-md font-medium bg-slate-300 border-slate-200 border-2 rounded-xl">
        Username
    </div>
    <div class="inline-flex h-10 items-center justify-center px-3 text-md font-medium">
        {`Level ${level}`}
    </div>
    <div class="flex-1"></div>
    <div class="inline-flex h-10 items-center justify-center px-3 text-3xl font-bold">
        Clickly 🤠
    </div>
    <div class="flex-1"></div>
    <Popover.Root>
        <Popover.Trigger class="inline-flex h-8 items-center justify-end px-4 transition hover:bg-slate-300 rounded-xl">
            {#each $notifications as notification}
                <button 
                class={`${notification.unread ? `<img src="Bell-Icon.svg" alt="bell" class="size-8` : `<BellDot/>`}`}>
                </button>
            {/each}
            <BellDot/>
        </Popover.Trigger>
        <Popover.Content
            class="z-20 w-full max-w-[250px] rounded-[12px] border bg-slate-800 p-4 text-white"
            transition={flyAndScale}
            sideOffset={8}
        >
            <div class="bg-slate-800">
                <Popover.Arrow class="rounded-[2px] border-l border-t border-slate-950" />
            </div>
            <div class="flex items-center justify-start">
                <h2 class="text-lg font-bold">Notifications</h2>
            </div>
            <Separator.Root 
            class="my-2 shrink-0 bg-slate-300 data-[orientation=horizontal]:h-px data-[orientation=vertical]:h-full data-[orientation=horizontal]:w-full data-[orientation=vertical]:w-[1px]"/>
                {#each $notifications as notification}
                    <div class="flex flex-col py-2">
                        {@html notification.message}
                    </div>
                {/each}
        </Popover.Content>
    </Popover.Root>
    <Popover.Root>
        <Popover.Trigger class="inline-flex h-8 items-center justify-end px-4    transition hover:bg-slate-300 rounded-xl">
            <Settings/>
        </Popover.Trigger>
        <Popover.Content
            class="z-20 w-full max-w-[328px] rounded-[12px] border bg-slate-800 p-4 text-white"
            transition={flyAndScale}
            sideOffset={8}
        >
            <div class="bg-slate-800">
                <Popover.Arrow class="rounded-[2px] border-l border-t border-slate-950" />
            </div>
            <div class="flex items-center justify-between">
                <h2 class="text-lg font-bold">Settings</h2>
            </div>
        </Popover.Content>
    </Popover.Root>
</div>

<style lang="postcss">
    .header {
        border-radius: 0px 0px 12px 12px;
    }
</style>