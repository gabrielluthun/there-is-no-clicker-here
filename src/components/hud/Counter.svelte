<script lang="ts">
  export let clicks = 0;
  export let revealed = false;
  export let frozenCap: number | null = null;

  // `frozenCap` lets the final phase lock visual display at 250 while internal
  // click count can continue.
  $: displayClicks = frozenCap == null ? clicks : Math.min(clicks, frozenCap);
  $: label = displayClicks > 1 ? 'clics' : 'clic';
</script>

<div id="counter" class:hidden={!revealed} class:revealed={revealed}>
  <span id="counter-value">{displayClicks.toLocaleString('fr-FR')}</span>
  <span id="counter-label">{label}</span>
</div>

<style>
  #counter {
    position: fixed;
    bottom: 16px;
    left: 50%;
    transform: translateX(-50%);
    font-size: 14px;
    color: var(--muted);
    z-index: 20;
    letter-spacing: 2px;
    opacity: 0;
    transition: opacity 1.2s ease;
    pointer-events: none;
    font-variant-numeric: tabular-nums;
  }

  #counter.revealed {
    opacity: 1;
  }

  #counter-value {
    color: var(--fg);
    font-weight: bold;
    margin-right: 4px;
  }
</style>
