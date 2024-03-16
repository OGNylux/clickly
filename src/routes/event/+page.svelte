<script lang="ts">
    import CookieEventWrapper from "$lib/components/events/CookieEventWrapper.svelte";
    import { loadLocalStorage, save } from "$lib/save";
    import { onMount } from "svelte";
</script>

<CookieEventWrapper />