<script lang="ts">
    import { formatNumber } from "$lib/formatNumber";


    export let value = 0;
  
    let current = 0,
        interval = 0,
        step = 0;

    // listen to changes in value
    $: value, startCount();
  
    function startCount() {
        clearInterval(interval);
        const diff = value - current;
        step = Math.ceil(diff / 10);
        interval = setInterval(() => {
            current += step;
            if (Math.abs(current - value) <= Math.abs(step)) {
                current = value;
                clearInterval(interval);
            }
        }, 20);
    }
</script>
    
<span>{formatNumber(current)}</span>