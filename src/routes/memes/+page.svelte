<!-- Gallery.svelte -->
<script lang="ts">
    import {ArrowLeftIcon} from "lucide-svelte";

    let imageList: string[] = [
        "01.gif",
        "01.jpg",
        "02.jpg",
        "04.jpg",
        "05.jpg",
        "06.jpg",
        "02.png",
        "03.png",
        "04.png",
        "05.png",
        "06.png",
        "07.png",
        "08.png",
        "09.png",
        "10.png",
        "11.png",
        "12.png",
        "13.png",
        "14.png",
        "15.png",
        "16.png",
        "17.png",
        "18.png",
        "19.png",
        "20.png",
        "21.png",
        "22.png",
    ];

</script>
<div class="flex justify-center">
    <a href="/" class="hidden md:inline-flex dark:text-black self-center w-fit">
        <ArrowLeftIcon class="w-12 h-12"/>
    </a>
    <h1 class="flex justify-center text-4xl md:text-9xl text-center dark:text-black">
        Impressum? Nein Memes!
    </h1>
</div>
<div class="image-gallery flex flex-wrap m-9 justify-center items-center">
    {#each imageList as image (image)}
        <img src={`memes/${image}`} alt={"alt"} class="max-w-full h-[200px] m-2 transition-transform transform hover:scale-[2.25] hover:z-10"  />
    {/each}
</div>

<style>
    .image-gallery {
        display: flex;
        flex-direction: row;
    }
</style>
