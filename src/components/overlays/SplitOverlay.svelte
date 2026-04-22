<script lang="ts">
  export let visible = false;
</script>

{#if visible}
  <div class="split-overlay" aria-hidden="true"></div>
{/if}

<style>
  .split-overlay {
    position: fixed;
    inset: 0;
    z-index: 35;
    pointer-events: none;
    background:
      linear-gradient(to right, transparent 49.5%, rgba(255, 255, 255, 0.2) 50%, transparent 50.5%),
      linear-gradient(to bottom, transparent 49.5%, rgba(255, 255, 255, 0.2) 50%, transparent 50.5%);
    animation: split-flash 1.2s ease-out forwards;
  }
</style>
