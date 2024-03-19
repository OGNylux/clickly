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
        farmUpgrades,
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
        type GameState,
        type Event,
        serverMessageTypes,
        eventTypes,
        type EventResult,
        type LeaderboardPosition,
        type EventEndMessage,
    } from "$lib/api";
    import { Socket } from "$lib/websocket";
    import type { FarmItem, StoreItem, FarmUpgrade } from "$lib/data";
    import EventWrapper from "$lib/components/EventWrapper.svelte";

    let socket: WebSocket,
        saveInterval = 0,
        activeEvent: Event | null = null,
        eventResult: EventResult | null = null,
        isLoaded = false;

    onMount(() => {
        if (user.get() == null) return;

        isClassic.set(false);
        socket = Socket.getInstance().getSocket();

        socket.onmessage = async (event) => {
            console.log("Message from server", event.data);
            const m: ServerMessage = JSON.parse(event.data);
            if (m.type == serverMessageTypes.GameState) {
                let gameState: GameState = JSON.parse(m.message.toString());
                
                unlockAllunlockedItems(getLevel(gameState.score));

                score.set(gameState.score);
                emojis.set(gameState.emojis);
                crops.set(gameState.crops);
                
                const clicker = unlockedClicker.get();
                clicker.addItem(Number(gameState.clicker));
                unlockedClicker.update(clicker)

                unlockedPassiveItems.get().forEach((item: StoreItem, index: number) => {
                    item.addItem(Number(gameState.passive[index]));
                    unlockedPassiveItems.update(item);
                });
                
                farmUpgrades.get().forEach((item: FarmUpgrade, index: number) => {
                    item.addItem(Number(gameState.farmUpgrades[index]));
                    farmUpgrades.update(item);
                });
                
                unlockedFarmItems.get().forEach((item: FarmItem, index: number) => {
                    item.setAmount(Number(gameState.farm[index]));
                    unlockedFarmItems.update(item);
                });
                isLoaded = true;
            } else if (m.type == serverMessageTypes.EventStart){
                const e = eventTypes.get(m.message.toString());
                if (e){
                    activeEvent = e;
                } else {
                    throw new Error("Event not found");
                }
            } else if (m.type == serverMessageTypes.EventEnd){
                const eventEndMessage = m.message as EventEndMessage;
                let leaderboard: LeaderboardPosition[] = [];
                eventEndMessage.Leaderboard.forEach((item) => {
                    leaderboard.push({
                        username: item.Name,
                        score: item.Score,
                    });
                });
                eventResult = {
                    leaderboard: leaderboard,
                    place: eventEndMessage.Place,
                }
                activeEvent = null;
            }
        };
        socket.onclose = (event) => {
            console.error("Connection closed", event);
        };
        socket.onerror = (event) => {
            console.error("Connection error", event);
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

            let farmUpgrade: number[] = [];
            farmUpgrades.get().forEach((item) => {
                farmUpgrade.push(item.getAmount());
            });

            let farm: number[] = [];
            unlockedFarmItems.get().forEach((item) => {
                farm.push(item.getAmount());
            });

            let gameState: GameState = {
                score: score.get(),
                emojis: emojis.get(),
                crops: crops.get(),
                clicker: unlockedClicker.get().getAmount(),
                passive: arr,
                farmUpgrades: farmUpgrade,
                farm: farm,
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
            socket.send(JSON.stringify(message));
        }, 1000);
    });

    onDestroy(() => {
        clearInterval(saveInterval);
    });

    function sendEventStart(){
        const message: ClientMessage = {
            // @ts-ignore
            username: user.get(),
            type: clientMessageTypes.DebugEvent,
            message: {},
        };
        socket.send(JSON.stringify(message));
    }
</script>

<nav class="w-full h-16">
    <Header username={$user}/>
</nav>
<main class="flex justify-around gap-2 screen">
    <EventWrapper {activeEvent} {eventResult} />
    <Buildings />
    <div id="main" class="screen grid grid-rows-2">
        {#if isLoaded}
            <Clicker />
        {/if}
        <Farm />
    </div>
    <Shop />
</main>
<button class="fixed bottom-0 right-0" on:click={() => sendEventStart()}>Start Debug Event</button>

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