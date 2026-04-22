<script lang="ts">
  export let visible = false;
  export let label = 'chargement de rien';
</script>

{#if visible}
  <div class="fake-loader" aria-hidden="true">
    <div class="fake-loader-label">{label}</div>
    <div class="fake-loader-bar"><div class="fake-loader-fill"></div></div>
  </div>
{/if}

<style>
  .fake-loader {
    position: fixed;
    top: 30%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: min(320px, 70vw);
    z-index: 50;
    text-align: center;
    color: var(--fg);
    font-size: 11px;
    letter-spacing: 2px;
    text-transform: uppercase;
  }

  .fake-loader-label {
    margin-bottom: 8px;
    color: var(--muted);
  }

  .fake-loader-bar {
    height: 4px;
    background: #2a2a30;
    overflow: hidden;
  }

  .fake-loader-fill {
    height: 100%;
    width: 0%;
    background: var(--accent);
    animation: loader-fill 2.4s cubic-bezier(.6, .1, .4, 1) forwards;
  }
</style>
