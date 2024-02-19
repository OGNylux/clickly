<script lang="ts">
    import { Settings, BellDot } from "lucide-svelte";
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
    <div class="inline-flex h-10 items-center justify-end px-6 text-md font-medium">
        <BellDot/>
    </div>
    <div class="inline-flex h-10 items-center justify-end px-6 text-md font-medium">
        <Settings/>
    </div>
</div>

<style lang="postcss">
    .header {
        border-radius: 0px 0px 12px 12px;
    }
</style>