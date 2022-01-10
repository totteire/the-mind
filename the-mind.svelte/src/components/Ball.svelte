<script>
  export let big = false
  export let number;
  import { fly } from 'svelte/transition';

  let transition = {};
  if (big) {
    transition = { y: 50, duration: 1000 };
  } else {
    transition = { x: 1500, duration: 2000 };
  }
</script>

<div class="ball" class:big transition:fly={transition}>
  <div class="number">{number}</div>
</div>
<style>
  .ball {
    background-image: url(/assets/ball.png);
    background-size: cover;
    background-position: center;
    width: 4em;
    height: 4em;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .ball .number {
    font-size: 1.5em;
  }
  .big.ball {
    width: 9em;
    height: 9em;
  }
  .big.ball .number {
    font-size: 4em;
  }

</style>
