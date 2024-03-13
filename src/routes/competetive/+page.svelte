<script lang="ts">
    import Shop from "$lib/components/shop/Shop.svelte";
    import Buildings from "$lib/components/BuildingsWrapper.svelte";
    import Clicker from "$lib/components/clicker/Clicker.svelte";
    import { onDestroy, onMount } from "svelte";
    import { unlockAllunlockedItems } from "$lib/helper";
    import {
        crops,
        emojis,
        isClassic,
        score,
        unlockedClicker,
        unlockedFarmItems,
        unlockedPassiveItems,
        user,
    } from "$lib/store";
    import {
        clientMessageTypes,
        type ClientMessage,
        type ServerMessage,
    } from "$lib/api";
    import { Socket } from "$lib/websocket";

    let socket: WebSocket;
    let saveInterval = 0;

    interface GameState {
        score: number;
        emojis: number;
        crops: number;
        clicker: number;
        passive: number[];
        farm: number[];
    }

    onMount(async () => {
        if (user.get() == null) return;

        isClassic.set(false);

        socket = Socket.getInstance().getSocket();

        console.log("Connected to server");

        socket.onmessage = (event) => {
            const m: ServerMessage = JSON.parse(event.data);
            if (m.type == "gameState") {
                console.log("Received game state", m.message);
                let gameState: GameState = JSON.parse(m.message.toString());
                console.log("Game state", gameState);
                score.set(gameState.score);
                crops.set(gameState.crops);
                emojis.set(gameState.emojis);


               // unlockedClicker.update(gameState.clicker);
               // unlockedPassiveItems.update(gameState.passive);


                // score.set(m.message.score);
                // crops.set(m.message.crops);
                // unlockedClicker.update(m.message.clicker);
                // unlockedPassiveItems.update(m.message.passive);
                // unlockedFarmItems.update(m.message.farm);
            } else {
                console.log("Received unknown message", m);
            }
        };
        socket.onclose = (event) => {
            console.log("Connection closed", event);
        };
        socket.onerror = (event) => {
            console.log("Connection error", event);
        };

        const message: ClientMessage = {
            // @ts-ignore
            username: user.get(),
            type: clientMessageTypes.GetState,
            message: {},
        };

        console.log("Sending get state message", message);
        socket.send(JSON.stringify(message));

        // unlockAllunlockedItems($score);

        saveInterval = setInterval(() => {
            let arr: number[] = [];
            unlockedPassiveItems.get().forEach((item) => {
                arr.push(item.getAmount());
            });

            let gameState: GameState = {
                score: score.get(),
                emojis: emojis.get(),
                crops: crops.get(),
                clicker: unlockedClicker.get().getAmount(),
                passive: [],
                farm: [1, 2],
            };

            const message: ClientMessage = {
                // @ts-ignore
                username: user.get(),
                type: clientMessageTypes.SetState,
                message: {
                    rest: JSON.stringify(gameState).toString(),
                    score: gameState.score,
                },
            };
            console.log("Sending set state message", message);
            socket.send(JSON.stringify(message));
        }, 1000);
    });

    onDestroy(() => {
        clearInterval(saveInterval);
    });
</script>

<div class="w-full h-screen">
    <nav class="w-screen h-16">
        <p>Rank: deine Mudda</p>
    </nav>
    <main class="flex justify-around gap-2">
        <Buildings />
        <Clicker />
        <Shop />
    </main>
</div>
