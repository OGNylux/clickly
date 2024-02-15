<script>
	import Register from './Register.svelte';
    import { Button } from "bits-ui";
    let username = "";
    let password = "";

    function register() {
        // Add your registration logic here
        console.log("Registering...");
        console.log("Username:", username);
        console.log("Password:", password);
    }
</script>

<div>
    <label for="username">Username:</label>
    <input type="text" id="username" bind:value={username} />

    <label for="password">Password:</label>
    <input type="password" id="password" bind:value={password} />

    <Button.Root
        class="inline-flex h-12 items-center justify-center rounded-input bg-dark
                px-[21px] text-[15px] font-semibold text-background shadow-mini
                hover:bg-dark/95 active:scale-98 active:transition-all"
    >
        Register
    </Button.Root>
</div>
