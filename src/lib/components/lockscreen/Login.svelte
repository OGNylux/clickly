<script lang="ts">
    import { Button } from "bits-ui";
    import { onMount } from "svelte";
    import {clientMessageTypes,serverMessageTypes} from "$lib/api";
    import type { ClientMessage,ServerMessage} from "$lib/api";

    let username = "";
    let password = "";
    let socket: WebSocket;
    let loggedIn = false;

    onMount(() => {
        socket = new WebSocket('ws://localhost:8080/ws');
        socket.onopen = () => {
            console.log("Connected to server");
        };
        socket.onmessage = (event) => {
            let test : ServerMessage = JSON.parse(event.data);
            console.log(test);
            if (test.type === serverMessageTypes.Success){
                loggedIn = true;
            }
            console.log(event.data);
        };
    });

    function handleLogin() {
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

<div class="flex flex-col gap-1 justify-center items-center h-28">
    <label for="username">Username:</label>
    <input type="text" id="username" bind:value={username} />

    <label for="password">Password:</label>
    <input type="password" id="password" bind:value={password} />
    <div class="flex flex-row justify-center items-center">
        <Button.Root
            class="inline-flex h-12 items-center justify-center rounded-input bg-dark
                        px-[21px] text-[15px] font-semibold text-background shadow-mini
                        hover:bg-dark/95 active:scale-98 active:transition-all"
            on:click={handleLogin}
        >
            Login
        </Button.Root>
        {#if loggedIn}
            <p>Logged in</p>
        {/if}
    </div>
</div>
