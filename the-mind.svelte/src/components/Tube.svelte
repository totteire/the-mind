<script>
  import { me } from "../store";
  import Ball from "./Ball.svelte";
  import { fly } from "svelte/transition";

</script>

{#if $me?.cards?.length}
  <div
    class="tube"
    transition:fly={{ y: 300, duration: 1000, delay: 0, opacity: 1 }}
  >
    {#each $me.cards as card}
      <Ball number={card} />
    {/each}
  </div>
{/if}

<style>
  .tube {
    background: linear-gradient(
      rgba(255, 255, 255, 0.45),
      rgba(27, 51, 170, 0.15) 45%
    );
    mix-blend-mode: screen;
    position: fixed;
    width: 100%;
    height: 4em;
    bottom: 5%;
    z-index: 5;
    display: flex;
    align-items: center;
    justify-content: center;
  }
</style>
