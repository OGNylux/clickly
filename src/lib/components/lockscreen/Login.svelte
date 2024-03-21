<script lang="ts">
    import { Button } from "bits-ui";
    import { onDestroy } from "svelte";
    import { clientMessageTypes, serverMessageTypes } from "$lib/api";
    import type { ClientMessage, ServerMessage } from "$lib/api";
    import { Ban } from "lucide-svelte";
    import { user } from "$lib/store";
    import { goto } from "$app/navigation";
    import { Socket } from "$lib/websocket";

    let username = "";
    let password = "";
    let errorMsg ="";

    let socket: WebSocket | null = null;

    async function initWs() {
        socket = Socket.getInstance().getSocket();
        await new Promise((resolve) => {
            socket!.onopen = resolve;
        });

        socket.onmessage = (event) => {
            let test : ServerMessage = JSON.parse(event.data);
            if (test.type === serverMessageTypes.Success){
                user.login(username);
                goto("/competitive")
            } else if (test.type === serverMessageTypes.Error){
                errorMsg = test.message.toString();
            }
        };
        socket.onclose = ()=>{
            errorMsg = " Fuck you (reload Page)"
        }
    }
    async function handleLogin(){
        if (socket == null){
            await initWs()
        }

        let test: ClientMessage = {
            username: username,
            type: clientMessageTypes.Authentication,
            message:{
                password: password,
            },
        };

        socket!.send(JSON.stringify(test));
    }
</script>

    <form on:submit={() => {if(username != "" && password != "") handleLogin}} class="grid place-items-start gap-2 h-full">
        <label for="usernameLogIn" class="text-sm font-medium">Username:</label>
        <input 
            type="text" 
            id="usernameLogIn" 
            bind:value={username} 
            class="shadow-sm rounded-md w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-sky-500 focus:border-sky-500" 
        />
    
        <label for="passwordLogIn" class="block text-sm font-medium">Password:</label>
        <input 
            type="password" 
            id="passwordLogIn" 
            bind:value={password} 
            class="shadow-sm rounded-md w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-sky-500 focus:border-sky-500" 
        />
        <Button.Root
            class="relative mt-6 py-2 shadow-sm rounded-md text-lg bg-sky-500 w-full text-white font-semibold active:scale-98 active:transition-all disabled:bg-sky-200 disabled:text-black"
            on:click={handleLogin}
            disabled={username == "" || password == ""}
        >
            Login
            {#if errorMsg !== ""}
            <div class="absolute text-red-600 -top-7 flex items-center">
                <Ban size={18} />
                <span class="truncate">{errorMsg}</span>
            </div>
            {/if}
        </Button.Root>
    </form>
