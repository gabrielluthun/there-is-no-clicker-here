<script lang="ts">
  export let grown = false;
</script>

<div id="core-dot" class="stage-dot" class:grown></div>

<style>
  .stage-dot {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 8px;
    height: 8px;
    background: var(--fg);
    border-radius: 50%;
    box-shadow: 0 0 16px rgba(255, 255, 255, 0.5);
    transition: all 0.6s ease;
  }

  .stage-dot.grown {
    width: 18px;
    height: 18px;
  }
</style>
