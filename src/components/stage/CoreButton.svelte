<script lang="ts">
  export let label = 'ARRÊTER';
  export let onPress: (() => void) | null = null;

  const handleClick = (event: MouseEvent): void => {
    event.stopPropagation();
    onPress?.();
  };
</script>

<button id="core-btn" class="stage-button" type="button" on:click={handleClick}>
  {label}
</button>

<style>
  .stage-button {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: transparent;
    color: var(--fg);
    border: 1px solid var(--fg);
    padding: 12px 28px;
    font-family: inherit;
    font-size: 14px;
    letter-spacing: 3px;
    text-transform: uppercase;
    cursor: pointer;
    transition: all 0.3s ease;
  }

  .stage-button:hover {
    background: var(--fg);
    color: var(--bg);
  }
</style>
