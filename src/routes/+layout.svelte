<script>
    import { onMount } from "svelte";
    import "../app.css";
    import { loadLocalStorage, save } from "$lib/save";

    onMount(() => {
        loadLocalStorage();
        save();
    });
</script>

<slot></slot>