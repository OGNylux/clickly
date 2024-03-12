<script lang="ts">
    import { serverMessageTypes, type ServerMessage } from "$lib/api";
    import { X, Check } from "lucide-svelte";
    import { Button } from "bits-ui";

    let username = "";
    let validUsername = 0;
    let password = "";
    let success: boolean | null = null;

    function register() {
        const data = {
            name: username,
            password: password,
        };

        fetch("http://johafo.de:18143/registerUser", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        })
            .then((response) => {
                if (!response.ok) success = false;
                else success = true;
            })
            .catch((error) => {
                console.log("Error:", error);
                // Handle any errors here
            });
    }

    function checkUsernameChange() {
        if (!isValidString(username)) {
            validUsername = 0;
            return;
        }
        fetch("http://johafo.de:18143/usernameCheck", {
            method: "POST",
            headers: {
                "Content-Type": "text/plain",
            },
            body: username,
        }).then((response) => {
            if (!response.ok) {
                validUsername = 0;
                console.log("Username already exists");
            } else {
                validUsername = 1;
            }
        });
    }
    let safeTimeoutForName: number;

    function isValidString(str: string) {
        if (str.length <= 3) return false;
        const regex = /^[a-zA-Z0-9_]+$/;
        return regex.test(str);
    }
    function onUsernameChange() {
        validUsername = 2;
        clearTimeout(safeTimeoutForName);
        safeTimeoutForName = setTimeout(checkUsernameChange, 500);
    }

    $: username && onUsernameChange();
</script>

<div class="flex flex-col gap-1 justify-center items-center">
    <label for="username">Username:</label>
    <div class="flex flex-row">
        <input type="text" id="username" bind:value={username} />
        <div class="pl-2">
            {#if validUsername === 0}
                <X color="#fc1703" />
            {:else if validUsername === 1}
                <Check color="#6ffc03" />
            {:else}
                <div class="animate-pulse">...</div>
            {/if}
        </div>
    </div>
    <label for="password">Password:</label>
    <input type="password" id="password" bind:value={password} />
    <Button.Root
        on:click={register}
        disabled={username == "" ||
            password == "" ||
            validUsername == 0 ||
            validUsername == 2}
        class="w-40 font-bold text-base relative overflow-hidden px-6 py-1 rounded-xl bg-slate-100 text-slate-950 mt-2 disabled:bg-gray-400 disabled:cursor-not-allowed "
    >
        Register
    </Button.Root>
</div>
