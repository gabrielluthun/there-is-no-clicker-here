<script lang="ts">
  export let visible = false;
  export let label = 'NE PAS APPUYER';
  export let onPress: (() => void) | null = null;

  const handleClick = (event: MouseEvent): void => {
    event.stopPropagation();
    onPress?.();
  };
</script>

{#if visible}
  <button class="tempt-btn" type="button" on:click={handleClick}>{label}</button>
{/if}

<style>
  .tempt-btn {
    position: fixed;
    bottom: 40px;
    right: 40px;
    background: transparent;
    color: var(--danger);
    border: 1px solid var(--danger);
    padding: 10px 22px;
    font-family: inherit;
    font-size: 11px;
    letter-spacing: 3px;
    text-transform: uppercase;
    cursor: pointer;
    z-index: 40;
    animation: tempt-appear 6s ease-in-out forwards;
  }
</style>
