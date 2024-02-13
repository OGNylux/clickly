<script lang="ts">
    import { unlockedClicker, unlockedPassiveItems } from "$lib/store";
    import { Separator } from "bits-ui";
    import Building from "./Building.svelte";
</script>

<div class="flex flex-col gap-2">
    <Building storeItem={$unlockedClicker} />
    <Separator.Root class="m-1 h-1 rounded bg-slate-200" />
    {#each $unlockedPassiveItems as item}
        <Building storeItem={item} />
    {/each}
</div>
