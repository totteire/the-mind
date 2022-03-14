<script>
  import {deckStore as deck} from '../store';
  import { blur, fade } from 'svelte/transition';
  import Ball from "./Ball.svelte";

  // First appearence
  let visible = false;
  setTimeout(() => visible = true, 500);

  let currentNumber;
  deck.subscribe(newDeck => {
    if (currentNumber) {
      currentNumber = undefined;
      setTimeout(() => currentNumber = newDeck.pop(), 500)
    } else {
      currentNumber = newDeck.pop();
    }
  });
</script>

<div>
  {#if visible}
    <div class="porthole" transition:fade={{duration: 1000}}>
    </div>
    <div class="background" transition:blur={{duration: 4000}}>
      {#if currentNumber}
        <Ball big number={currentNumber}/>
      {/if}
    </div>
  {/if}
</div>

<style>
  .porthole {
    position: fixed;
    top: calc(50% - 12em);
    left: calc(50% - 12em);
    width: 24em;
    height: 24em;
    background-image: url("/assets/Hublot.png");
    background-size: cover;
    background-position: center;
    z-index: 2;
  }
  .background {
    position: fixed;
    top: calc(50% - 10em);
    left: calc(50% - 10em);
    z-index: 0;
    background: linear-gradient(135deg, #CF2AE1, #009FDC);
    width: 20em;
    height: 20em;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
</style>
