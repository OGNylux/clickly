<script lang="ts">
    import { Button } from "bits-ui";

    let username = "";
    let password = "";

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
        .then(response => response.json())
        .then(result => {
            console.log('Success:', result);
        })
        .catch(error => {
            // Handle any errors here
        });
        
    }
</script>

<div class="flex flex-col gap-1 justify-center items-center">
    <label for="username">Username:</label>
    <input type="text" id="username" bind:value={username} />

    <label for="password">Password:</label>
    <input type="password" id="password" bind:value={password} />

    <Button.Root
        class="inline-flex h-12 items-center justify-center rounded-input bg-dark
                px-[21px] text-[15px] font-semibold text-background shadow-mini
                hover:bg-dark/95 active:scale-98 active:transition-all"
        on:click={register}
    >
        Register
    </Button.Root>
</div>
