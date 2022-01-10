<script>
  import {onMount} from "svelte";
  import Players from "./components/Players.svelte";
  import Porthole from "./components/Porthole.svelte";
  import Tube from "./components/Tube.svelte";
  import Buttons from "./components/Buttons.svelte";
  import Dashboard from "./components/Dashboard.svelte";
  import {gameStore as game, playersStore as players, onDeckAdd, onDeckRemove,
    onGameChange, onPlayerAdd, onPlayerChange, onPlayerRemove, me, setMe} from "./store";

  const host = window.document.location.host.replace(/:.*/, '');
  const client = new Colyseus.Client(location.protocol.replace("http", "ws") + "//" + host + (location.port ? ':2567' : ''));

  let room;

  const roomName = window.location.pathname.split('\/')[2];
  onMount(async () => {
    // TODO find room and join
  });

  
  let playerName;
  if (localStorage.getItem('name')) {
      playerName = localStorage.getItem('name');
  }
  $: {
    localStorage.setItem('name', playerName);
    if (room)
      room.send('action', { name: playerName });
  }
  const startGame = (e) => room.send('action', {action: 'START_GAME' });
</script>

{#if !$game.isStarted}
  <div class="preGameContainer">
    <input bind:value={playerName} type="text" class="playerName" placeholder="player's name">
    <button on:click={startGame}>START GAME</button>
  </div>
{/if}

<main class:blur={!$game.isStarted}>
  <div class="left">
    {#if $game.isStarted}
      <Players/>
    {/if}
  </div>
  <div class="middle">
    <Porthole/>
  </div>
  <div class="right">
    {#if $game.isStarted}
      <Dashboard/>
    {/if}
  </div>
  {#if $game.isStarted}
    <Buttons/>
    <Tube/>
  {/if}
</main>

<style>
  main {
    transition: 1s ease all;
    display: flex;
    flex-direction: row;
    min-height: 100%;
    background: linear-gradient(135deg, #030305, #04104D);
  }
  .blur {
    filter: blur(10px);
  }

  .left {
    z-index: 15;
    width: 25vw;
    min-height: 100%;
  }

  .middle {
    width: 50vw;
    min-height: 100%;
  }

  .right {
    z-index: 5;
    width: 25vw;
    min-height: 100%;
    display: flex;
    flex-direction: column;
    align-items: end;
  }

  .preGameContainer {
    height: 100%;
    min-width: 100vw;
    display: flex;
    align-items: center;
    justify-self: center;
    background-color: transparent;
    position: fixed;
    top: 0;
    right: 0;
    z-index: 1;
  }
  .preGameContainer input {

  }
</style>