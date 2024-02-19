<script lang="ts">
    import { Settings, BellDot } from "lucide-svelte";
    import { Popover } from "bits-ui";
    import { flyAndScale } from "$lib/transition";
</script>

<div class="flex h-14 items-center bg-slate-200 px-3 header">
    <div class="inline-flex h-10 items-center justify-center px-3 text-md font-medium bg-slate-300 border-slate-200 border-2 rounded-xl">
        Username
    </div>
    <div class="inline-flex h-10 items-center justify-center px-3 text-md font-medium">
        LVL
    </div>
    <div class="flex-1"></div>
    <div class="inline-flex h-10 items-center justify-center px-3 text-3xl font-bold">
        Clickly 🤠
    </div>
    <div class="flex-1"></div>
    <Popover.Root>
        <Popover.Trigger class="inline-flex h-10 items-center justify-end px-6 transition hover:bg-slate-300 rounded-xl">
            <BellDot/>
        </Popover.Trigger>
        <Popover.Content
            class="z-20 w-full max-w-[328px] rounded-[12px] border border-dark-10 bg-slate-800 p-4 text-white"
            transition={flyAndScale}
            sideOffset={8}
        >
            <div class="bg-slate-800">
                <Popover.Arrow class="rounded-[2px] border-l border-t border-slate-950" />
            </div>
            <div class="flex items-center justify-between">
                <h2 class="text-lg font-bold">Notifications</h2>
                <button class="text-sm font-medium text-dark-50">
                    Mark all as read
                </button>
            </div>
        </Popover.Content>
    </Popover.Root>
    <Popover.Root>
        <Popover.Trigger class="inline-flex h-10 items-center justify-end px-6 transition hover:bg-slate-300 rounded-xl">
            <Settings/>
        </Popover.Trigger>
        <Popover.Content
            class="z-20 w-full max-w-[328px] rounded-[12px] border border-dark-10 bg-slate-800 p-4 text-white"
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