<script>
</script>
<div class="dashboard">
  <div class="level">LEVEL <span class="levelNumber">3</span></div>
  <div class="heartContainer">
    <div class="heart"></div>
    <div class="heart"></div>
    <div class="heart"></div>
  </div>
  <div class="bonusContainer">
    <div class="bonus"></div>
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
