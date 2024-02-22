<script lang="ts">
    import { onMount } from "svelte";
    import { Settings, Bell } from "lucide-svelte";
    import { Popover, Separator } from "bits-ui";
    import { flyAndScale } from "$lib/transition";
    import { getLevel } from "$lib/helper";
    import { notifications, score } from "$lib/store";

    let level = 0;

    onMount(() => {
        level = getLevel($score);
    });

    function updateReadStatus() {
        notifications.update((notifications) => {
            return notifications.map((notification) => {
                return {
                    ...notification,
                    unread: false,
                };
            });
        });
    }
</script>

<div class="grid grid-cols-3 h-10 items-center bg-slate-200 px-3 header content-center">
    <div class="place-self-start flex items-center">
        <div class="flex h-8 px-3 bg-slate-300 border-slate-200 border-2 rounded-xl">
            <div class="font-medium">
                Username
            </div>
        </div>
        <div class="flex items-center px-3 font-medium">
            {`Level ${level}`}
        </div>
    </div>
    <div class="place-self-center flex items-center px-3 text-xl font-semibold">
        Clickly 🤠
    </div>
    <div class="place-self-end flex">
        <Popover.Root>
            <Popover.Trigger class="items-center justify-end px-4">
                <div class="transition hover:bg-slate-300 rounded-3xl p-1">
                    {#if $notifications.some(notification => notification.unread)}
                        <button on:click={() => updateReadStatus()}>
                            <img src="Bell-Icon.svg" alt="bell" class="size-6"/>
                        </button>
                    {:else}
                        <Bell />
                    {/if}
                </div>
            </Popover.Trigger>
            <Popover.Content
                class="z-20 w-full max-w-[230px] rounded-xl border bg-slate-800 p-4 text-white"
                transition={flyAndScale}
                sideOffset={8}
            >
                <div class="bg-slate-800">
                    <Popover.Arrow class="rounded-sm border-l border-t border-slate-950" />
                </div>
                <div class="flex items-center justify-center">
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
            <Popover.Trigger class="items-center justify-end px-4">
                <div class="transition hover:bg-slate-300 rounded-3xl p-1">
                    <Settings/>
                </div>
            </Popover.Trigger>
            <Popover.Content
                class="z-20 w-full max-w-[230px] rounded-xl border bg-slate-800 p-4 text-white"
                transition={flyAndScale}
                sideOffset={8}
            >
                <div class="bg-slate-800">
                    <Popover.Arrow class="rounded-sm border-l border-t border-slate-950" />
                </div>
                <div class="flex items-center justify-center">
                    <h2 class="text-lg font-bold">Settings</h2>
                </div>
                <Separator.Root 
                class="my-2 shrink-0 bg-slate-300 data-[orientation=horizontal]:h-px data-[orientation=vertical]:h-full data-[orientation=horizontal]:w-full data-[orientation=vertical]:w-[1px]"/>
                Wer das ließt ist nen hs 😎
            </Popover.Content>
        </Popover.Root>
    </div>
</div>

<style lang="postcss">
    .header {
        border-radius: 0px 0px 12px 12px;
    }
</style>