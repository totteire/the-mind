<script>
  import {gameStore as game} from '../store';
</script>
<div class="dashboard">
  <div class="level">LEVEL <span class="levelNumber">{$game.level}</span></div>
  <div class="heartContainer">
    {#each Array($game.lifes) as life}
      <div class="heart"></div>
    {/each}
    </div>
  <div class="bonusContainer">
    {#each Array($game.shuriken) as bonus}
      <div class="bonus"></div>
    {/each}
  </div>
</div>
<style>
  .dashboard {
    margin-top: 3em;
    margin-right: 3em;
  }
  .level {
    color: white;
  }
  .level .levelNumber {
    color: #725EDF;
    padding-left: 0.5em
  }
  .heartContainer, .bonusContainer {
    display: flex;
  }
  .heart, .bonus {
    background-size: cover;
    width: 2em;
    height: 2em;
  }
  .heart {
    background-image: url("/assets/Coeur.png");
  }
  .bonus {
    background-image: url("/assets/Shuriken_Seul.png");
  }
</style>
