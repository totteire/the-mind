<script>
  import {deckStore as deck} from '../store';
  import { blur, fade } from 'svelte/transition';
  import Ball from "./Ball.svelte";

  let visible = false;
  setTimeout(() => visible = true, 500);
</script>

<div>
  {#if visible}
    <div class="porthole" transition:fade={{duration: 1000}}>
      {#if $deck.length}
        <Ball big number={$deck[$deck.length - 1]}/>
      {/if}
    </div>
    <div class="hole" transition:blur={{duration: 4000}}>
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
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .hole {
    position: fixed;
    top: calc(50% - 10em);
    left: calc(50% - 10em);
    z-index: 1;
    background: linear-gradient(135deg, #CF2AE1, #009FDC);
    width: 20em;
    height: 20em;
    border-radius: 50%;
  }
</style>
