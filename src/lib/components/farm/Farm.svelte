<script lang="ts">
    import FarmObjekt from "$lib/components/farm/FarmObject.svelte";
</script>

<div class="w-full h-full rounded-xl border-2 border-slate-200 relative grid place-content-center bg-[url(grasstile.svg)]" id="farm">
    <div class="grid grid-cols-4 place-content-center gap-4">
        {#each { length: 3} as _}
            <FarmObjekt />
        {/each}
    </div>
    <div class="absolute grid place-content-center inset-0 -z-0">
        <svg width="489" height="269" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path class="fill-amber-800" d="M9.408 98.621a12 12 0 0 1 1.354-4.373L57.694 6.7A12 12 0 0 1 70.418.564l180.734 32.882c1.279.232 2.588.256 3.875.068l169.23-24.62a12 12 0 0 1 13.28 8.628l25.789 91.75c.225.803.534 1.58.921 2.319l23.308 44.526a12 12 0 0 1-2.854 14.704l-101.772 86.62a11.998 11.998 0 0 1-6.886 2.828L258.88 269l-181.39-8.793a12 12 0 0 1-8.017-3.615L3.942 189.278a12 12 0 0 1-3.332-9.667l8.798-80.99Z" fill="#D9D9D9"/>
        </svg>
    </div>
</div>

<style lang="postcss">
    #farm {
        background: url('grass.svg');
        background-size: cover;
    }
</style> 