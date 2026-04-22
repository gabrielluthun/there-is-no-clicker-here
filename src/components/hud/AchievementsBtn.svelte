<script lang="ts">
  export let revealed = false;
  export let hidden = true;
  export let onClick: (() => void) | null = null;

  const handleClick = (event: MouseEvent): void => {
    event.stopPropagation();
    onClick?.();
  };
</script>

<button
  id="achievements-btn"
  class:hidden
  class:revealed={revealed}
  title="achievements"
  type="button"
  on:click={handleClick}
>
  ★
</button>

<style>
  #achievements-btn {
    position: fixed;
    top: 16px;
    right: 16px;
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 18px;
    color: var(--muted);
    border: 1px solid var(--muted);
    border-radius: 50%;
    cursor: pointer;
    z-index: 30;
    opacity: 0;
    transition: all 0.3s ease;
    background: transparent;
  }

  #achievements-btn.revealed {
    opacity: 0.5;
  }

  #achievements-btn:hover {
    opacity: 1;
    color: var(--accent);
    border-color: var(--accent);
  }
</style>
