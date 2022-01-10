<script>
  import {gameStore as game} from '../store';
  import { scale } from 'svelte/transition';
  import { quintOut, elasticOut } from 'svelte/easing';
</script>
<div class="dashboard">
  <div class="level">LEVEL <span class="levelNumber">{$game.level}</span></div>
  <div class="heartContainer">
    {#each Array($game.lifes) as life}
      <div class="heart" transition:scale="{{duration: 800, delay: 1000, opacity: 0.5, easing: elasticOut}}"></div>
    {/each}
    </div>
  <div class="bonusContainer">
    {#each Array($game.shuriken) as bonus}
      <div class="bonus" transition:scale="{{duration: 800, delay: 1000, opacity: 0.5, easing: elasticOut}}"></div>
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
