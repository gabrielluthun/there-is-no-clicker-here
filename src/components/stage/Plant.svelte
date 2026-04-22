<script lang="ts">
  export let stage: 'seed' | 'leaf' | 'flower' = 'seed';

  $: emoji = stage === 'seed' ? '🌱' : stage === 'leaf' ? '🌿' : '🌸';
</script>

<div id="plant-el" class="plant">{emoji}</div>

<style>
  .plant {
    position: absolute;
    bottom: 8px;
    left: 16px;
    font-size: 28px;
    z-index: 2;
    transform-origin: bottom center;
    animation: plant-sway 5s ease-in-out infinite;
  }
</style>
