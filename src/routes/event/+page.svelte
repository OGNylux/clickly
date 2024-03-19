<script lang="ts">
    import { user } from "$lib/store";
    import { onMount } from "svelte";

    let score = 0,
        sequence: number[] = [],
        userIndex = 0,
        userInput = false;

    let context: AudioContext;
    let sample: AudioBuffer;

    onMount(async () => {
        context = new AudioContext();
        sample = await fetch("/events/simon.mp3")
            .then((response) => response.arrayBuffer())
            .then((buffer) => context.decodeAudioData(buffer));
        sequence.push(getRandomNumber());
        playSequence();
    });

    function playSound(rate: number) {
        const source = context.createBufferSource();
        source.buffer = sample;
        source.playbackRate.value = rate;
        source.connect(context.destination);
        source.start(0);
    }

    function getRandomNumber() {
        return Math.floor(Math.random() * 4);
    }

    function playSequence() {
        userInput = false;
        for (let index = 0; index < sequence.length; index++) {
            setTimeout(() => {
                flashButton(sequence[index]);
            }, 1000 * index);
            setTimeout(() => {
                userInput = true;
            }, 1000 * sequence.length);
        }
    }

    function flashButton(index: number) {
        const button = document.getElementById(`b${index}`);
        button?.classList.add("brightness-150");
        playSound(1 + index * 0.2);
        setTimeout(() => {
            button?.classList.remove("brightness-150");
        }, 300);
    }

    function checkButton(buttonIndex: number) {
        if (userInput) {
            if (buttonIndex === sequence[userIndex]) {
                userIndex++;
                playSound(1 + buttonIndex * 0.2);

                if (userIndex === sequence.length) {
                    score++;
                    sequence.push(getRandomNumber());
                    userIndex = 0;
                    userInput = false;
                    setTimeout(() => {
                        playSequence();
                    }, 1000);
                }
            } else {
                playSound(0.4);
                score = 0;
                userIndex = 0;
                sequence = [];
                sequence.push(getRandomNumber());
                setTimeout(() => {
                    playSequence();
                }, 1000);
            }
        }
    }
</script>

<div class="flex flex-col w-[1000px] h-[480px] bg-slate-200 items-center p-5">
    <h1 class="text-6xl font-bold my-auto">Score: {score}</h1>
    <div
        class="grid grid-cols-2 grid-rows-2 h-full rounded-full overflow-hidden aspect-square gap-3 bg-slate-800 border-[0.75rem] border-slate-800"
    >
        <button
            id="b0"
            class="w-full h-full bg-[#C33737] rounded-xl transform active:scale-95 transition-transform active:brightness-150 disabled:scale-95"
            disabled={!userInput}
            on:click={() => checkButton(0)}
        ></button>
        <button
            id="b1"
            class="w-full h-full bg-[#5C913B] rounded-xl transform active:scale-95 transition-transform active:brightness-150 disabled:scale-95"
            disabled={!userInput}
            on:click={() => checkButton(1)}
        ></button>
        <button
            id="b2"
            class="w-full h-full bg-[#FFCC4D] rounded-xl transform active:scale-95 transition-transform active:brightness-150 disabled:scale-95"
            disabled={!userInput}
            on:click={() => checkButton(2)}
        ></button>
        <button
            id="b3"
            class="w-full h-full bg-[#55ACEE] rounded-xl transform active:scale-95 transition-transform active:brightness-150 disabled:scale-95"
            disabled={!userInput}
            on:click={() => checkButton(3)}
        ></button>
    </div>
</div>
