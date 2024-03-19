<script lang="ts">
    import { animate, timeline } from "motion";
    import { onMount } from "svelte";

    let time = 10000;
    const timeConst = time;
    let interval: number;
    let score;

    onMount(() => {
        interval = setInterval(() => {
            time -= 100;
            console.log(time);
            if(time <= timeConst * 0.85) {
                document.getElementById("time")?.classList.add("opacity-0");
            }
            if(time <= 0) {
                console.log("BOOM");
                document.getElementById("time")?.classList.add("opacity-100");
                boom();
                clearInterval(interval);
            }
        }, 100);

        function boom() {
            document.getElementById("boom")?.classList.remove("hidden");
            animate("#time", { opacity: [0, 1, 0] }, { duration: 0.75, easing: "ease-in-out", repeat: Infinity })

            timeline([
                ["#boom", { transform: ["scale(1)", "scale(50)"] }, { duration:0.225, easing: "linear" }],
                ["#boom", { transform: ["scale(50)"] }, { duration:2 }],
                ]).finished.then(() => {
                    animate("#boom", { transform: ["scale(50)", "scale(0)"] }, { duration:0.225, easing: "linear" }).finished.then(() => {
                    document.getElementById("boom")?.classList.add("hidden");
                });
            });
        }
    });

    function clickHandler() {
        animate(
            ".button",
            { transform: ["scaleY(1)", "scaleY(0.85)", "scaleY(1)"] },
            { easing: "ease-in-out" },
        );
        clearInterval(interval);
        score = 10000 - time;
        document.getElementById("time")?.classList.add("opacity-100");
        animate("#time", { opacity: [0, 1, 0] }, { duration: 0.75, easing: "ease-in-out", repeat: Infinity })
        console.log(score);
    }
</script>

<div
    class="flex w-[1000px] h-[480px] bg-slate-600 justify-center relative overflow-hidden"
>
    <span id="time" class="absolute text-8xl z-20 pt-[52px] text-left text-[#77B255]"
        >{(time / 1000).toFixed(2)}</span
    >
    <svg
        id="boom"
        class="absolute z-30 place-self-center hidden"
        xmlns="http://www.w3.org/2000/svg"
        width="36"
        height="36"
        viewBox="0 0 36 36"
        ><path
            fill="#BB1A34"
            d="M22 0l-4 8.028-5-5.018v7.024L3 8.028l8 8.028-11 6.02h12L6 34.118l12-8.028 11 10.035-3-14.049h10l-8-6.021 8-9.031-12 3.01L22 0z"
        />
        <path
            fill="#FCAB40"
            d="M22.914 12.924l1.86-.467L30 11.146l-3.381 3.816-1.319 1.49 1.59 1.195 2.925 2.202h-5.918l.473 2.218 1.551 7.26-5.845-5.332-1.056-.964-1.188.795-5.24 3.506 2.406-4.828 1.322-2.655H9.564l3.759-2.059 2.145-1.172-1.727-1.735-3.044-3.053 3.221.646 2.186.439V8.686l1.45 1.455 1.794 1.799 1.133-2.276 1.273-2.556"
        />
        <path
            fill="#F5F8FA"
            d="M21.512 14.301l.767-.193 2.158-.541-1.396 1.576-.545.615.656.493 1.208.909h-2.443l.195.916.641 2.997-2.413-2.201-.437-.398-.49.328-2.163 1.448.993-1.994.546-1.096H16l1.553-.85.885-.484-.713-.716-1.257-1.261 1.329.267.903.181v-1.745l.599.6.74.743.468-.939.525-1.056"
        />
    </svg>
    <div class="absolute p-6 z-10">
        <svg
            width="300"
            height="223"
            viewBox="0 0 449 335"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <g filter="url(#filter0_d_929_1870)">
                <path
                    d="M430 253.167C430 278.386 409.553 298.833 384.333 298.833H64.6667C39.4472 298.833 19 278.386 19 253.167V47.6667C19 22.4472 39.4472 2 64.6667 2H384.333C409.553 2 430 22.4472 430 47.6667V253.167Z"
                    fill="#31373D"
                />
                <path
                    d="M407.167 184.667C407.167 197.271 396.937 207.5 384.333 207.5H64.6666C52.0626 207.5 41.8333 197.271 41.8333 184.667V47.6666C41.8333 35.0626 52.0626 24.8333 64.6666 24.8333H384.333C396.937 24.8333 407.167 35.0626 407.167 47.6666V184.667Z"
                    fill="#C6E5B3"
                />
                <path
                    d="M178.833 253.167C178.833 265.771 168.604 276 156 276H64.6666C52.0626 276 41.8333 265.771 41.8333 253.167C41.8333 240.563 52.0626 230.333 64.6666 230.333H156C168.604 230.333 178.833 240.563 178.833 253.167ZM338.667 253.167C338.667 265.771 328.437 276 315.833 276H224.5C211.896 276 201.667 265.771 201.667 253.167C201.667 240.563 211.896 230.333 224.5 230.333H315.833C328.437 230.333 338.667 240.563 338.667 253.167Z"
                    fill="#66757F"
                />
                <path
                    d="M384.333 276C396.944 276 407.167 265.777 407.167 253.167C407.167 240.556 396.944 230.333 384.333 230.333C371.723 230.333 361.5 240.556 361.5 253.167C361.5 265.777 371.723 276 384.333 276Z"
                    fill="#DD2E44"
                />
            </g>
            <defs>
                <filter
                    id="filter0_d_929_1870"
                    x="0"
                    y="0"
                    width="449"
                    height="334.833"
                    filterUnits="userSpaceOnUse"
                    color-interpolation-filters="sRGB"
                >
                    <feFlood flood-opacity="0" result="BackgroundImageFix" />
                    <feColorMatrix
                        in="SourceAlpha"
                        type="matrix"
                        values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                        result="hardAlpha"
                    />
                    <feOffset dy="17" />
                    <feGaussianBlur stdDeviation="9.5" />
                    <feComposite in2="hardAlpha" operator="out" />
                    <feColorMatrix
                        type="matrix"
                        values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
                    />
                    <feBlend
                        mode="normal"
                        in2="BackgroundImageFix"
                        result="effect1_dropShadow_929_1870"
                    />
                    <feBlend
                        mode="normal"
                        in="SourceGraphic"
                        in2="effect1_dropShadow_929_1870"
                        result="shape"
                    />
                </filter>
            </defs>
        </svg>
    </div>
    <button
        on:click={() => clickHandler()}
        class="absolute place-self-end z-10"
    >
        <svg
            width="300"
            height="207"
            viewBox="0 0 446 311"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <g filter="url(#filter0_d_923_3794)">
                <path
                    d="M389 172.121V136.871C389 74.5671 57 74.5671 57 136.871V172.146C57 219.431 131.322 257.761 223 257.761C314.678 257.761 389 219.427 389 172.142V172.121Z"
                    fill="#E0E0E0"
                />
            </g>
            <path
                d="M223 222.489C314.679 222.489 389 184.156 389 136.871C389 89.5847 314.679 51.252 223 51.252C131.321 51.252 57 89.5847 57 136.871C57 184.156 131.321 222.489 223 222.489Z"
                fill="#666666"
            />
            <path
                class="button"
                style="transform-origin: bottom center;"
                d="M353.725 122.964V67.4247C353.725 9.18362 92.2791 9.18362 92.2791 67.4247V122.981C92.2791 160.219 150.807 190.402 223.004 190.402C295.202 190.402 353.729 160.215 353.729 122.977L353.725 122.964Z"
                fill="#E15B64"
            />
            <path
                class="button"
                style="transform-origin: bottom center;"
                d="M223 134.85C295.197 134.85 353.725 104.663 353.725 67.4251C353.725 30.1872 295.197 0 223 0C150.802 0 92.2749 30.1872 92.2749 67.4251C92.2749 104.663 150.802 134.85 223 134.85Z"
                fill="#C33737"
            />
            <defs>
                <filter
                    id="filter0_d_923_3794"
                    x="0.599998"
                    y="37.7431"
                    width="444.8"
                    height="280.417"
                    filterUnits="userSpaceOnUse"
                    color-interpolation-filters="sRGB"
                >
                    <feFlood flood-opacity="0" result="BackgroundImageFix" />
                    <feColorMatrix
                        in="SourceAlpha"
                        type="matrix"
                        values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                        result="hardAlpha"
                    />
                    <feOffset dy="4" />
                    <feGaussianBlur stdDeviation="28.2" />
                    <feComposite in2="hardAlpha" operator="out" />
                    <feColorMatrix
                        type="matrix"
                        values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
                    />
                    <feBlend
                        mode="normal"
                        in2="BackgroundImageFix"
                        result="effect1_dropShadow_923_3794"
                    />
                    <feBlend
                        mode="normal"
                        in="SourceGraphic"
                        in2="effect1_dropShadow_923_3794"
                        result="shape"
                    />
                </filter>
            </defs>
        </svg>
    </button>
    <div class="relative overflow-hidden place-self-end">
        <svg
            width="1000"
            height="400"
            viewBox="0 0 1100 400"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <g filter="url(#filter0_d_929_1876)">
                <path d="M1 121L550.5 53L1100 121V508H1V121Z" fill="#CBD5E1" />
            </g>
            <defs>
                <filter
                    id="filter0_d_929_1876"
                    x="-44.7"
                    y="0.299999"
                    width="1190.4"
                    height="546.4"
                    filterUnits="userSpaceOnUse"
                    color-interpolation-filters="sRGB"
                >
                    <feFlood flood-opacity="0" result="BackgroundImageFix" />
                    <feColorMatrix
                        in="SourceAlpha"
                        type="matrix"
                        values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                        result="hardAlpha"
                    />
                    <feOffset dy="-7" />
                    <feGaussianBlur stdDeviation="22.85" />
                    <feComposite in2="hardAlpha" operator="out" />
                    <feColorMatrix
                        type="matrix"
                        values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
                    />
                    <feBlend
                        mode="normal"
                        in2="BackgroundImageFix"
                        result="effect1_dropShadow_929_1876"
                    />
                    <feBlend
                        mode="normal"
                        in="SourceGraphic"
                        in2="effect1_dropShadow_929_1876"
                        result="shape"
                    />
                </filter>
            </defs>
        </svg>
    </div>
</div>

<style>
    #time {
	    transition: opacity 0.25s;
    }
</style>