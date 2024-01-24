<script>
    import { onMount } from "svelte";
    import "../app.css";
    import { init } from "$lib/localSave";

    onMount(() => {
        init();
    });
</script>

<slot></slot>