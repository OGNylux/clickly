<script lang="ts">
    import { crops, emojis, score, isClassic, unlockedPassiveItems, unlockedFarmItems } from "$lib/store";
    import { reset } from "$lib/save";

    let isVisible = false;
    let emojiAmount = 1000;
    let cropAmount = 1000;
</script>

<aside class="fixed bottom-0 left-0 z-20 p-4 bg-sky-200 rounded">
    {#if !isVisible}
        <button on:click={() => isVisible = true}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-eye"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
        </button>
    {:else}
        <div class="grid gap-2">
            <button on:click={() => isVisible = false}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-eye-off"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/><line x1="2" x2="22" y1="2" y2="22"/></svg>
            </button>
            <p>Score: {$score}</p>
            <p>Emoji count: {$emojis}</p>
            <p>Crops count: {$crops}</p>
            <p>Classic mode: {$isClassic ? "on" : "off"}</p>
            <p>unlockedPassiveItems: <br>
                {#each $unlockedPassiveItems as item}
                   <span class="text-red-400">{item.name}</span> |
                {/each}
            </p>
            <p>unlockedFarmItems: <br>
                {#each $unlockedFarmItems as item}
                   <span class="text-red-400">{item.name}</span> |
                {/each}
            </p>
            <div>
                <button class="bg-sky-500 p-1 rounded" on:click={() => emojis.decrement(emojiAmount)}>-💩</button>
                <input class="p-1 rounded" type="number" name="debug" bind:value={emojiAmount}>
                <button class="bg-sky-500 p-1 rounded" on:click={() => {emojis.increment(emojiAmount); score.increment(emojiAmount) }}>+💩</button>
            </div>
            <div>
                <button class="bg-sky-500 p-1 rounded" on:click={() => crops.decrement(cropAmount)}>-🍆</button>
                <input class="p-1 rounded" type="number" name="debug" bind:value={cropAmount}>
                <button class="bg-sky-500 p-1 rounded" on:click={() => {crops.increment(cropAmount); }}>+🍆</button>
            </div>
            <button class="bg-sky-500 p-1 rounded" on:click={() => reset()}>reset</button>
    	</div>
    {/if}
</aside>