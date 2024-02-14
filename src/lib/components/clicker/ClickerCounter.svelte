<script lang="ts">
    import { formatNumber } from '$lib/helper';

    export let value = 0;
  
    let current = 0,
        interval = 0,
        step = 0;

    // listen to changes in value
    $: value, lol();
  
    function lol () {
        console.log('value', value);
        if (current < value) {
            // FIXME: when counting up, it doesn't work
            step = Math.ceil((value - current) / 50);
            console.log('step c < v', step);
            
            interval = setInterval(() => {
                if (current >= value) {
                    console.log('stop');
                    current = value;
                    clearInterval(interval);
                }
                current += step;
            }, 20);
        } else if (current > value) {
            step = Math.ceil((current - value) / 50);
            console.log('step c > v', step);
            interval = setInterval(() => {
                if (current <= value) {
                    console.log('stop');
                    current = value;
                    clearInterval(interval);
                }
                current -= step;
            }, 20);
        }
    }
</script>
    
<span bind:this={a}>{formatNumber(current)}</span>