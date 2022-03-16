<script>
  import { onMount } from "svelte";
  import { joinOrCreate, setPlayerName, startGame } from "../api.service";

  let playerName;

  onMount(async () => {
    // TODO find room and join
    const roomName = window.location.pathname.split("/")[2];
    await joinOrCreate(roomName);
    if (localStorage.getItem("name")) {
      playerName = localStorage.getItem("name");
    }
  });

  $: {
    if (playerName) {
      localStorage.setItem("name", playerName);
      setPlayerName(playerName);
    }
  }
</script>

<div class="dashboard">
  <div class="preGameContainer">
    <label for="playerName">Your name</label>
    <input
      id="playerName"
      bind:value={playerName}
      type="text"
      class="playerName"
      placeholder="player's name"
    />
    <button on:click={startGame}>START GAME</button>
  </div>
</div>

<style>
  .preGameContainer {
    height: 100%;
    min-width: 100vw;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: transparent;
    position: fixed;
    top: 0;
    right: 0;
    z-index: 1;
  }
</style>
