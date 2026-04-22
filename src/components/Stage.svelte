<script lang="ts">
  import CoreButton from './stage/CoreButton.svelte';
  import CoreDot from './stage/CoreDot.svelte';
  import Critter from './stage/Critter.svelte';
  import Fly from './stage/Fly.svelte';
  import MatrixRain from './stage/MatrixRain.svelte';
  import Plant from './stage/Plant.svelte';
  import Stars from './stage/Stars.svelte';

  export let showCoreDot = false;
  export let coreDotGrown = false;
  export let showCoreButton = false;
  export let coreButtonLabel = 'ARRÊTER';
  export let onCoreButtonPress: (() => void) | null = null;

  export let showCritter1 = false;
  export let critter1Awake = false;
  export let showCritter2 = false;
  export let showCritter3 = false;

  export let plantStage: 'hidden' | 'seed' | 'leaf' | 'flower' = 'hidden';
  export let showStars = false;
  export let showFly = false;
  export let showMatrixRain = false;

  // Narrow once to keep template comparisons type-safe.
  $: resolvedPlantStage = plantStage === 'hidden' ? null : plantStage;
</script>

<div id="stage" aria-hidden="true">
  {#if showCoreDot}
    <CoreDot grown={coreDotGrown} />
  {/if}

  {#if showCoreButton}
    <CoreButton label={coreButtonLabel} onPress={onCoreButtonPress} />
  {/if}

  {#if showCritter1}
    <Critter
      id="critter-1"
      emoji={critter1Awake ? '◉' : '·'}
      left={12}
      top={80}
      color={critter1Awake ? '#e8e8ea' : '#7a7a82'}
      fontSize={32}
    />
  {/if}

  {#if showCritter2}
    <Critter id="critter-2" emoji="◉" left={85} top={30} color="#58e0c0" />
  {/if}

  {#if showCritter3}
    <Critter id="critter-3" emoji="◈" left={50} top={18} color="#f9d35c" />
  {/if}

  {#if resolvedPlantStage}
    <Plant stage={resolvedPlantStage} />
  {/if}

  {#if showStars}
    <Stars />
  {/if}

  {#if showFly}
    <Fly />
  {/if}

  {#if showMatrixRain}
    <MatrixRain />
  {/if}
</div>

<style>
  #stage {
    position: fixed;
    inset: 0;
    overflow: hidden;
    z-index: 1;
  }
</style>
