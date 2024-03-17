<script lang="ts">
    import { onMount } from 'svelte';
    import { FallingItem } from '$lib/data';

    export let width = 0;
    export let height = 0;
    export let score = 0;

    const numOfCookies = 20;

    let canvas: HTMLCanvasElement | null,
        context: CanvasRenderingContext2D | null,
        fallingObjects: FallingItem[] = [],
        fps = 60,
        now = performance.now(),
        then = performance.now();

    onMount(() => {
        if (!canvas) return;
        context = canvas.getContext('2d');

        let cookie = new Image();
            cookie.src = 'emojis/cookie.svg';
            
        for (let i = 0; i < numOfCookies; i++) {
            let x = Math.random() * canvas.width;
            let y = -40 - Math.random() * 100;
            let size = 100 + Math.random() * 70;
            fallingObjects.push(new FallingItem(cookie, x, y, size));
        }

        requestAnimationFrame(draw);

        canvas.addEventListener('click', handleClick);
    });

    function draw() {
        if (!context || !canvas) return;

        now = performance.now();
        const elapsed = now - then;
        requestAnimationFrame(draw);

        if (elapsed < 1000 / fps) return;

        then = now - (elapsed % (1000 / fps));
        context.clearRect(0, 0, canvas.width, canvas.height);

        fallingObjects.forEach((falling) => {
            if (!context || !canvas) return;

            if(falling.size > 140) context.drawImage(falling.img, falling.x, falling.y, falling.size, falling.size);

            context.globalAlpha = 0.05;
            context.fillStyle = "white";
            context.fillRect(0, 0, canvas.width, canvas.height);
            context.globalAlpha = 1;

            if(falling.size > 120) context.drawImage(falling.img, falling.x, falling.y, falling.size, falling.size);

            context.globalAlpha = 0.05;
            context.fillStyle = "white";
            context.fillRect(0, 0, canvas.width, canvas.height);
            context.globalAlpha = 1;

            if (falling.size > 100) context.drawImage(falling.img, falling.x, falling.y, falling.size, falling.size);
            

            falling.y += 0.025 * falling.size;
            if(falling.clicked) {
                if(falling.size > 0.25) falling.size = falling.size * 0.9;
                else {falling.y = height + 20; falling.size = 100}
            }
            if (falling.y > height + 20) {
                falling.y = -40;
                falling.clicked = false;
                falling.size = 100 + Math.random() * 70;
                falling.x = Math.random() * canvas.width;
            }
        });
    }

    function handleClick(event: MouseEvent) {
        if (!canvas) return;
        const rect = canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        // Check if the click occurred on any falling object
        fallingObjects.forEach((falling) => {
            if (x >= falling.x && x <= falling.x + falling.size/4 && y >= falling.y && y <= falling.y + falling.size/4) {
                falling.clicked = true;
                score++;
                return; // Exit loop after logging the click
            }
        });
    }
</script>

<div>
    <canvas
        bind:this={canvas}
        style={`width: ${width}px; height: ${height}px; background: transparent;`}
        height={height}
        width={width}
    />
</div>
