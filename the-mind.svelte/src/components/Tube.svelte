<script>
  import { me, gameStore as game } from "../store";
  import Ball from "./Ball.svelte";
  import { flip } from "svelte/animate";
  import { fly } from "svelte/transition";

  let timeout = 0;
  let myCards = [];
  me.subscribe((me) => {
    const { cards } = me;
    if (cards.length === myCards.length) {
      timeout = 0;
      return;
    }
    if (cards.length > myCards.length) {
      timeout += 300;
      setTimeout(() => myCards = [...myCards, cards[cards.length-1]], timeout);
    } else {
      myCards = [...cards];
    }
  });
</script>

{#if $game.isStarted}
  <div
    class="tube"
    transition:fly={{ y: 300, duration: 1000, delay: 0, opacity: 1 }}
  >
    {#each myCards as card (card)}
      <div animate:flip>
        <Ball number={card} />
      </div>
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
