<script lang="ts">
    import { unlockedClicker, unlockedPassiveItems } from "$lib/store";
    import { Separator } from "bits-ui";
    import Building from "./Building.svelte";
</script>

<div class="flex">
    <div class="border-slate-100 border-2 ml-1 bg-slate-50 rounded-xl p-2 overflow-y-auto">
        <div class="flex flex-col gap-2 ">
            <Building storeItem={$unlockedClicker} />
            <Separator.Root class="m-1 h-1 rounded bg-slate-200" />
            {#each $unlockedPassiveItems as item}
                <Building storeItem={item} />
            {/each}
        </div>
    </div>
</div>
