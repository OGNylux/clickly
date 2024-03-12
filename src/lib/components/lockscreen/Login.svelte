<script lang="ts">
    import { Button } from "bits-ui";
    import { onDestroy } from "svelte";
    import {clientMessageTypes,serverMessageTypes} from "$lib/api";
    import type { ClientMessage,ServerMessage} from "$lib/api";

    let username = "";
    let password = "";
    let socket: WebSocket;
    let loggedIn = false;
    let errorMsg ="";


    // Die Funktion kann weg, wenn wir wissen was wir mit dem Websocket dann machen
    onDestroy(() => {
        if (socket) socket.close();
    });

    async function handleLogin(){
        socket = new WebSocket('ws://johafo.de:18143/ws');
        await new Promise((resolve) => {
            socket.onopen = resolve;
        });
        console.log("Connected to server");
        // Das zuhören hier ist dann vermutlich (nach erfolgreichen Login) nicht mehr nötig
        socket.onmessage = (event) => {
            let test : ServerMessage = JSON.parse(event.data);
            console.log(test);
            if (test.type === serverMessageTypes.Success){
                loggedIn = true;
            } else if (test.type === serverMessageTypes.Error){
                errorMsg = test.message.toString();
            }
            console.log(event.data);
        };
        socket.onclose = (event) => {
            console.log("Connection closed");
        };

        // Um dann mit dem listen aufzuhören
        //socket.removeEventListener('message', () => {});

        let test: ClientMessage = {
            username: username,
            type: clientMessageTypes.Authentication,
            message:{
                password: password,
            },
        };
        console.log(test);
        socket.send(JSON.stringify(test));
    }
</script>

<div class="flex flex-col gap-1 justify-center items-center">
    <label for="username">Username:</label>
    <input type="text" id="username" bind:value={username} />

    <label for="password">Password:</label>
    <input type="password" id="password" bind:value={password} />
    <div class="flex flex-row justify-center items-center">
        <Button.Root
            class="inline-flex h-12 items-center justify-center rounded-input bg-dark
                        px-[21px] text-[15px] font-semibold text-background shadow-mini
                        hover:bg-dark/95 active:scale-98 active:transition-all disabled:bg-gray-600"
            on:click={handleLogin}
            disabled={username == "" || password == ""}
        >
            Login
        </Button.Root>
        {#if loggedIn}
            <p>Logged in</p>
        {/if}
        {#if errorMsg !== ""}
            <p>{errorMsg}</p>
        {/if}
    </div>
</div>
