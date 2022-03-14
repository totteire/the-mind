<script>
  export let big = false;
  export let number;
  import { fly } from "svelte/transition";
</script>

{#if big}
  <div
    class="big ball"
    in:fly={{ y: 500, duration: 1000, delay: 1000 }}
    out:fly={{ y: -500, duration: 1000 }}
  >
    <div class="number">{number}</div>
  </div>
{:else}
  <div
    class="ball"
    in:fly={{ x: 1500, duration: 2000 }}
    out:fly={{ x: -1500, duration: 2000 }}
  >
    <div class="number">{number}</div>
  </div>
{/if}

<style>
  .ball {
    background-image: url(/assets/ball.png);
    background-size: cover;
    background-position: center;
    width: 4em;
    height: 4em;
    margin: 10px;
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
