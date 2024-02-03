<script lang="ts">
    import { formatNumber } from '$lib/helper';

    export let value = 0;
  
    let current = 0;
    $: step = Math.max(1, Math.floor((value - current) / 100));
  
    function countUp() {
      if (current !== value) {
        current += step;
        setTimeout(countUp, 20);
      }
    }
  
    $: if (value > current) {
        countUp();
    } else if (value < current) {
        step = -step;
        countUp();
    }
  </script>
  
  <span>{formatNumber(current)}</span>
  