<script lang="ts">
  export let text = '';
  export let visible = false;
  export let fading = false;
</script>

{#if visible}
  <div class="big-text" class:fadeout={fading} aria-hidden="true">{text}</div>
{/if}

<style>
  .big-text {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: clamp(40px, 12vh, 120px);
    font-weight: 900;
    letter-spacing: 8px;
    color: var(--accent);
    pointer-events: none;
    z-index: 15;
    text-shadow: 4px 4px 0 rgba(0, 0, 0, 0.5);
    animation: popin 0.8s ease-out;
  }

  .fadeout {
    animation: fadeout 2s ease-out forwards;
  }
</style>
