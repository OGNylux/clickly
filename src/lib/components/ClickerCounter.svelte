<script lang="ts">
    export let value = 0;
  
    let current = 0;
    let step = 1;
  
    function countUp() {
      if (current !== value) {
        current += step;
        setTimeout(countUp, 25);
      }
    }
  
    $: if (value > current) {
        console.log('value > current');
        step = Math.max(1, Math.floor((value - current) / 100));
        countUp();
    } else if (value < current) {
        step = -Math.max(1, Math.floor((value - current) / 100));
        countUp();
    }
  </script>
  
  <span>{current}</span>
  