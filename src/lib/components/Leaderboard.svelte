<script lang="ts">
    import { clientMessageTypes, type ClientMessage, type ServerMessage } from "$lib/api";
    import { formatNumber } from "$lib/formatNumber";
    import { user } from "$lib/store";
    import { Socket } from "$lib/websocket";

    let socket: WebSocket;
    let leaderboard: any;

    getLeaderboard();

    function getLeaderboard() {
        if (user.get() == null) return;
        
        socket = Socket.getInstance().getSocket();

        const message: ClientMessage = {
            // @ts-ignore
            username: user.get(),
            type: clientMessageTypes.GetLeaderboard,
            message: {}
        };

        socket.send(JSON.stringify(message));
        
        socket.onmessage = (event) => {
            const m: ServerMessage = JSON.parse(event.data);
            if (m.type == "leaderboard") {
                leaderboard = m.message;
            }
        };
        
        socket.onclose = (event) => {
            console.log("Connection closed", event);
        };
        socket.onerror = (event) => {
            console.log("Connection error", event);
        };
    }
</script>

<div>
    {#if leaderboard}
         {#each leaderboard as item, i}
             <div class="grid grid-cols-2">
                <p class="w-40 truncate"><span class={`${i > 2 ? 'text-white' : 'text-amber-300'}`}>{i+1}. </span>{item.username}</p>
                <p class="text-end truncate">{formatNumber(item.score)} E</p>
             </div>
         {/each}
    {/if}
</div>