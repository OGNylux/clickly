<script lang="ts">
    import { X, Check, Loader2  } from "lucide-svelte";
    import { Button, Tooltip } from "bits-ui";
    import { flyAndScale } from "$lib/transition";

    let username = "";
    let validUsername = 0;
    let password = "";
    let success: boolean = false;

    function register() {
        const data = {
            name: username,
            password: password,
        };

        fetch("https://johafo.de/registerUser", {
            method: "POST",
            headers: {
                "Authorization": "Basic Sm9oYW5uZXM6QTd0S01LSyRtJDNrZWFNOCZA",
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        })
            .then((response) => {
                if (!response.ok) success = false;
                else success = true;
            })
            .catch((error) => {
                console.error("Error:", error);
            });
    }

    function checkUsernameChange() {
        if (!isValidString(username)) {
            rule = "Rules: Only alphanumeric characters and underscores are allowed. The length must be more than 3 characters."
            validUsername = 0;
            return;
        }
        fetch("https://johafo.de/usernameCheck", {
            method: "POST",
            headers: {
                "Authorization": "Basic Sm9oYW5uZXM6QTd0S01LSyRtJDNrZWFNOCZA",
                "Content-Type": "text/plain",
            },
            body: username,
        }).then((response) => {
            if (!response.ok) {
                validUsername = 0;
                rule = "Username already exists. Please choose another one."
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
    let rule = "Rules: Only alphanumeric characters and underscores are allowed. The length must be more than 3 characters.";
</script>

{#if !success}
    <form on:submit={() => {if(!(username == "" || password == "" || validUsername == 0 || validUsername == 2)) register}} class="grid place-items-start gap-2 h-full">
        <label for="usernameRegister" class="text-sm font-medium">Username:</label>
        <div class="relative w-full" title={rule}>
            <input 
                type="text" 
                id="usernameRegister" 
                bind:value={username} 
                class="shadow-sm rounded-md w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-sky-500 focus:border-sky-500" 
            />
            <div class="absolute top-0 right-0 h-full flex items-center mr-2">
                <Tooltip.Root>
                    <Tooltip.Trigger> 
                        {#if validUsername === 0}
                            <X color="#fc1703" />
                        {:else if validUsername === 1}
                            <Check color="#6ffc03" />
                        {:else}
                            <Loader2  class="animate-spin"/>
                        {/if}
                    </Tooltip.Trigger>
                    <Tooltip.Content
                        transition={flyAndScale}
                        transitionConfig={{ y: 8, duration: 150 }}
                        sideOffset={-5}
                        side={'top'}
                    >
                        <div class="bg-slate-200">
                            <Tooltip.Arrow class="rounded-[2px] border-l border-t border-slate-300" />
                        </div>
                        <div class="text-center border-slate-300 bg-slate-200 p-2 font-medium shadow-2xl outline-none rounded-xl">
                            {#if validUsername === 1}
                                <p>The Username is available.</p>
                            {:else}
                                <p>{rule}</p>
                            {/if}
                        </div>
                    </Tooltip.Content>
                </Tooltip.Root>
                
            </div>
        </div>

        <label for="passwordRegister" class="text-sm font-medium">Password:</label>
        <input 
            type="password" 
            id="passwordRegister" 
            bind:value={password} 
            class="shadow-sm rounded-md w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-sky-500 focus:border-sky-500" 
        />

        <Button.Root
            on:click={register}
            disabled={username == "" ||
                password == "" ||
                validUsername == 0 ||
                validUsername == 2}
            class="relative mt-6 py-2 shadow-sm rounded-md text-lg bg-sky-500 w-full text-white font-semibold active:scale-98 active:transition-all disabled:bg-sky-200 disabled:text-black"
        >
            Register
        </Button.Root>
    </form>
{:else}
    <div class="flex flex-col justify-center items-center h-full w-full">
        <Check color="#6ffc03" class="h-10 w-10"></Check>
        <p class="text-2xl pt-4">Successfully registered</p>
        <p>You can now login to your account</p>
    </div>
{/if}
