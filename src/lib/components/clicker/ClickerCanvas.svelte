<script lang="ts">
    import { onMount } from 'svelte';
    import { unlockedClicker } from '$lib/store';

    export let width = 0;
    
    let canvas: HTMLCanvasElement | null,
        context: CanvasRenderingContext2D | null,
        images: any[] = [],
        imageCount = 0,
        gravity = 0.5,
        friction = 0.9,
        fps = 60,
        now = performance.now(),
        then = performance.now(); 
  
    onMount(() => {
        if (!canvas) return;
        context = canvas.getContext('2d');
        for(let i = 0; i < imageCount; i++) {
            if (images.length == 150) break;
            
            let img = new Image();
            img.src = 'emojis/heart.svg';
            images.push({
                img,
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                dx: (Math.random() - 0.5) * 10,
                dy: (Math.random() - 0.5) * 10
            });
        }
        requestAnimationFrame(draw);
    });


    // TODO: optimize rendering (requestAnimationFrame)
    function draw() {
        if (!context || !canvas) return;

        now = performance.now();
        const elapsed = now - then;
        requestAnimationFrame(draw);

        if (elapsed < 1000 / fps) return; 

        then = now - (elapsed % (1000 / fps));
        context.clearRect(0, 0, canvas.width, canvas.height);

        for (let i = 0; i < imageCount; i++) {
            const image = images[i];
            context.drawImage(image.img, image.x, image.y);

            //calculate new position
            image.x += image.dx;
            image.y += image.dy;
            image.dy += gravity;

            // floor collision
            if (image.y + image.img.height > canvas.height) {
                image.dy = -image.dy * friction;
                image.y = canvas.height - image.img.height;
            }

            // wall collision and reset when out of bounds
            if (image.x + image.img.width > canvas.width+1) {
                image.x = canvas.width - image.img.width;
                image.dx = -image.dx;
            } else if (image.x < 0) {
                image.x = 0;
                image.dx = -image.dx;
            }
        }
    }

    $ : if ($unlockedClicker.getAmount() && canvas) {
        if (imageCount < $unlockedClicker.getAmount() && images.length < 150) {
            imageCount = $unlockedClicker.getAmount();
            for(let i = 0; i < imageCount; i++) {
                let img = new Image();
                img.src = 'emojis/heart.svg';
                images.push({
                    img,
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    dx: (Math.random() - 0.5) * 10,
                    dy: (Math.random() - 0.5) * 10
                });
            }
        } else if (imageCount > $unlockedClicker.getAmount()) {
            imageCount = $unlockedClicker.getAmount();
            images = images.slice(0, imageCount);
        }
    }
</script>
  
<canvas 
    bind:this={canvas} 
    class="absolute bottom-0"
    style={`width: ${width}px;`}
    height="200"
    width={width}
/>
