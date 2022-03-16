<script>
  import Players from "./components/Players.svelte";
  import Porthole from "./components/Porthole.svelte";
  import Tube from "./components/Tube.svelte";
  import Buttons from "./components/Buttons.svelte";
  import Dashboard from "./components/Dashboard.svelte";
  import Loby from "./components/Loby.svelte";
  import { gameStore as game } from "./store";

</script>

{#if !$game.isStarted}
  <Loby />
{/if}

<main class:blur={!$game.isStarted}>
  <div class="left">
    {#if $game.isStarted}
      <Players />
    {/if}
  </div>
  <div class="middle">
    <Porthole />
  </div>
  <div class="right">
    {#if $game.isStarted}
      <Dashboard />
    {/if}
  </div>
  {#if $game.isStarted}
    <Buttons />
    <Tube />
  {/if}
</main>

<style>
  main {
    transition: 1s ease all;
    display: flex;
    flex-direction: row;
    min-height: 100%;
    background: linear-gradient(135deg, #030305, #04104d);
  }

  .blur {
    filter: blur(10px);
  }

  .left {
    width: 25vw;
    min-height: 100%;
  }

  .middle {
    width: 50vw;
    min-height: 100%;
  }

  .right {
    width: 25vw;
    min-height: 100%;
    display: flex;
    flex-direction: column;
    align-items: end;
  }
</style>
