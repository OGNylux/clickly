<script lang="ts">
    import { onMount } from 'svelte';
    import { FallingItem } from '$lib/data';

    export let width = 0;
    export let height = 0;
    export let score = 0;

    let canvas: HTMLCanvasElement | null,
        context: CanvasRenderingContext2D | null,
        fallingObjects: FallingItem[] = [],
        fps = 60,
        now = performance.now(),
        then = performance.now();

    onMount(() => {
        if (!canvas) return;
        context = canvas.getContext('2d');

        for (let i = 0; i < 20; i++) {
            fallingObjects.push(new FallingItem(fallingObjects.length, Math.random() * canvas.width, -20 - Math.random() * 100, Math.random()));
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

        for (let i = 0; i < fallingObjects.length; i++) {
            const falling = fallingObjects[i];
            let cookie = new Image();
            cookie.src = 'emojis/cookie.svg';
            let cookieOverlay = new Image();
            cookieOverlay.src = 'emojis/cookieOverlay.svg';
            
            // Draw the object
            context.drawImage(cookie, falling.x, falling.y, falling.size, falling.size);
            context.globalAlpha = falling.opacity < 0.5 ? falling.opacity : 0.5;
            context.drawImage(cookieOverlay, falling.x, falling.y, falling.size, falling.size);
            context.globalAlpha = 1;

            falling.y += 0.025 * falling.size;
            if(falling.clicked) {
                if(falling.size > 0.25) falling.size = falling.size * 0.8;
                else {falling.y = height + 20; falling.size = 100}
            }
            if (falling.y > height + 20) {
                falling.y = -20;
                falling.clicked = false;
                falling.size = 100 + Math.random() * 70;
                falling.x = Math.random() * canvas.width;
            }
        }
    }

    function handleClick(event: MouseEvent) {
        if (!canvas) return;
        const rect = canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        // Check if the click occurred on any falling object
        for (let i = 0; i < fallingObjects.length; i++) {
            const falling = fallingObjects[i];
            if (x >= falling.x && x <= falling.x + falling.size/4 && y >= falling.y && y <= falling.y + falling.size/4) {
                falling.clicked = true;
                score++;
                console.log('Score:', score);
                break; // Exit loop after logging the click
            }
        }
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
