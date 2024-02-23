<script lang="ts">
    import { Settings, Bell } from "lucide-svelte";
    import { Popover, Separator } from "bits-ui";
    import { flyAndScale } from "$lib/transition";
    import { getLevel } from "$lib/helper";
    import { notifications, score } from "$lib/store";

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
            Level {getLevel($score)}
        </div>
    </div>
    <div class="place-self-center flex items-center px-3 text-xl font-semibold">
        Clickly 🤠
    </div>
    <div class="place-self-end flex">
        <Popover.Root>
            <Popover.Trigger class="items-center justify-end px-4" on:click={() => updateReadStatus()}>
                <div class="transition hover:bg-slate-300 rounded-3xl p-1">
                    {#if $notifications.some(notification => notification.unread)}
                        <svg class="size-6" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M25.8667 19.8667C26.9333 21.8667 28 22.6667 28 22.6667H4C4 22.6667 8 20.0001 8 10.6667C8 6.26675 11.6 2.66675 16 2.66675C16.9333 2.66675 17.7333 2.80008 18.5333 3.06675" stroke="black" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M13.7333 28C13.9565 28.4059 14.2846 28.7445 14.6833 28.9803C15.082 29.216 15.5368 29.3404 16 29.3404C16.4632 29.3404 16.918 29.216 17.3167 28.9803C17.7154 28.7445 18.0435 28.4059 18.2667 28" stroke="black" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
                            <circle cx="24" cy="10.6666" r="5.33333" fill="#0EA5E9"/>
                        </svg>
                    {:else}
                        <Bell />
                    {/if}
                </div>
            </Popover.Trigger>
            <Popover.Content
                class="z-20 w-full max-w-[240px] rounded-xl border bg-slate-800 p-4 text-white overflow-y-auto h-auto max-h-screen"
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