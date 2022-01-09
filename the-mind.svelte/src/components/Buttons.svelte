<script>
</script>

<div class="buttonsContainer">
  <div class="left">
    <div class="play">
      <div class="playText">PLAY</div>
    </div>
  </div>
  <div class="right">
    <div class="bonus"></div>
  </div>
</div>

<style>
  .play, .bonus {
    background-size: cover;
    width: 7em;
    height: 7em;
    margin: auto 2em;
  }
  .play {
    background-image: url("/assets/playBtnBg.png");
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .playText {
    font-size: 1.5em;
    color: #B3F5FF;
  }
  .bonus {
    background-image: url("/assets/bonusBtn.png");
  }
  .buttonsContainer {
    position: fixed;
    width: 100%;
    bottom: calc(5% + (100vw / 60 * 7) - 1em);
    z-index: 5;
    display: flex;
    justify-content: space-between;
  }
</style>
