<script lang="ts">
    import { serverMessageTypes, type ServerMessage } from "$lib/api";
    import { Button } from "bits-ui";

    let username = "";
    let validUsername = true;
    let password = "";
    let success : boolean | null = null;

    function register() {
        const data = {
            name: username,
            password: password
        };

        fetch('http://localhost:8080/registerUser', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(response => {
            if (!response.ok) success = false;
            else success = true;
        })
        .catch(error => {
            console.log('Error:', error);
            // Handle any errors here
        });
    }

    function handleUsernameChange(){
        fetch('http://localhost:8080/usernameCheck', {
            method: 'POST',
            headers: {
                'Content-Type': 'text/plain'
            },
            body: username
        }).then(response => {
            if (!response.ok) {
                validUsername = false;
                console.log('Username already exists');
            }
        });
    }

    $: username && handleUsernameChange();
</script>

<div class="flex flex-col gap-1 justify-center items-center">
        <label for="username">Username:</label>
        <input type="text" id="username" bind:value={username} />
    
        <label for="password">Password:</label>
        <input type="password" id="password" bind:value={password} />
    
        <Button.Root
            class="bg-transparent disabled:bg-black hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded"
            on:click={register}
            disabled={username == "" || password == "" || !validUsername}
        >
            Register
        </Button.Root>
</div>
