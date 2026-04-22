<script lang="ts">
  export let visible = false;
</script>

{#if visible}
  <div class="err-404" aria-hidden="true">404</div>
{/if}

<style>
  .err-404 {
    position: fixed;
    top: 30%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 80px;
    font-weight: 900;
    color: var(--danger);
    z-index: 50;
    letter-spacing: 8px;
    animation: err-glitch 1.4s steps(6, end) forwards;
    pointer-events: none;
  }
</style>
