<script>
    import { onMount } from "svelte";
    import "../app.css";
    import { loadLocalStorage, writeLocalStorage } from "$lib/save";

    onMount(() => {
        loadLocalStorage();
        writeLocalStorage();
    });
</script>

<slot></slot>