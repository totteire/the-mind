<script>
  import { playersStore } from '../store'
  let players=[];
  console.log(Object.keys($playersStore));
  for ( let i=0; i<Object.keys($playersStore).length;i++) {
      players.push($playersStore(i))
    }
  console.log(players)
</script>

<div class="players">
  <div class="header">
    <div class="rectangle">
      <div class="playerName">PLAYERS</div>
      <div class="playerBalls"></div>
    </div>
    <div class="bonus"></div>
  </div>
  {#each players as player}
  <div class="player">
    <div class="rectangle">
      <div class="playerName">{player.name}</div>
      {#if player.cards.length}
        <div class="playerBalls">{player.cards.length}</div>
      {/if}
    </div>
    {#if player.shurikenActive}
      <div class="bonus"></div>
    {/if}
  </div>
  {/each}
</div>

<style>
  .players {
    margin: 1em;
  }
  .player, .header {
    display: flex;
    align-items: center;
  }
  .player {
    margin-bottom: 1px;
  }
  .playerName {
    padding-right: 0.3em;
    color: #0090D2;
  }
  .rectangle, .playerName, .playerBalls, .bonus {
    display: inline-block;
  }
  .rectangle {
    width: 75%;
    display: flex;
    align-items: center;
    justify-content: end;
  }
  .player .rectangle {
    border: 1px solid;
    border-image-slice: 1;
    border-image-source: linear-gradient(to right, #00C9F6, #8D61EA);
  }
  .playerBalls {
    background-image: url(/assets/ballLight.png);
    background-size: cover;
    color: #8D61EA;
    height: 1.5em;
    font-size: 0.9em;
    width: 1.5em;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .bonus {
    background-image: url(/assets/Shuriken_Seul.png);
    background-size: cover;
    height: 1.5em;
    font-size: 1em;
    width: 1.5em;
    text-align: center;
  }
  .header {
    margin-bottom: 1em;
  }
</style>
