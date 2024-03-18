<script lang="ts">
    import Shop from "$lib/components/shop/Shop.svelte";
    import Buildings from "$lib/components/buildings/BuildingsWrapper.svelte";
    import Clicker from "$lib/components/clicker/Clicker.svelte";
    import Header from "$lib/components/Header.svelte";
    import Farm from "$lib/components/farm/Farm.svelte";
    import { onDestroy, onMount } from "svelte";
    import { getLevel, unlockAllunlockedItems } from "$lib/helper";
    import {
        crops,
        emojis,
        isClassic,
        score,
        unlockedClicker,
        unlockedPassiveItems,
        user,
    } from "$lib/store";
    import {
        clientMessageTypes,
        type ClientMessage,
        type ServerMessage,
        type GameState,
    } from "$lib/api";
    import { Socket } from "$lib/websocket";
    import type { StoreItem } from "$lib/data";

    let socket: WebSocket;
    let saveInterval = 0;

    onMount(() => {
        if (user.get() == null) return;

        isClassic.set(false);
        socket = Socket.getInstance().getSocket();

        socket.onmessage = (event) => {
            const m: ServerMessage = JSON.parse(event.data);
            if (m.type == "gameState") {
                let gameState: GameState = JSON.parse(m.message.toString());
                
                score.set(gameState.score);
                crops.set(gameState.crops);
                emojis.set(gameState.emojis);

                unlockAllunlockedItems(getLevel(score.get()));

                const clicker = unlockedClicker.get();
                clicker.addItem(Number(gameState.clicker));
                unlockedClicker.update(clicker)

                unlockedPassiveItems.get().forEach((item: StoreItem, index: number) => {
                    item.addItem(Number(gameState.passive[index]));
                    unlockedPassiveItems.update(item);
                });
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

        unlockAllunlockedItems(0); // if no save is present, unlock the first items
        socket.send(JSON.stringify(message));

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
                passive: arr,
                farm: [1, 2],
            };
            console.log(gameState);
            

            const message: ClientMessage = {
                // @ts-ignore
                username: user.get(),
                type: clientMessageTypes.SetState,
                message: {
                    rest: JSON.stringify(gameState).toString(),
                    score: gameState.score,
                },
            };
            socket.send(JSON.stringify(message));
        }, 1000);
    });

    onDestroy(() => {
        clearInterval(saveInterval);
    });
</script>

<nav class="w-full h-16">
    <Header/>
</nav>
<main class="flex justify-around gap-2 screen">
    <Buildings />
    <div id="main" class="screen grid grid-rows-2">
        <Clicker />
        <Farm />
    </div>
    <Shop />
</main>

<style lang="postcss">
    #main {
        /*  
            because a custom tailwind class does not work, this is the workaround. 
            IMPORTANT: when the width of the the buildings or shop changes, this value has to be adjusted.
            (w-80 * 2 = 20rem * 2)
        */ 
        width: calc(100vw - 48rem); 
    }
    .screen {
        height: calc(100vh - 4.25rem);
    }
</style>