<script lang="ts">
  import { PLAYER_NAME_TOKEN } from '$lib/game/player-name';

  export let visible = false;
  export let text =
    `tu voulais un défi, ${PLAYER_NAME_TOKEN} ?<br>tu l'as.<br><br><span class="faint">maintenant, évalue le jeu.</span><br><br>bisous.<br><br><strong>GAME OVER.</strong>`;
</script>

{#if visible}
  <div class="game-over-overlay" role="status" aria-live="polite">
    {@html text}
  </div>
{/if}

<style>
  .game-over-overlay {
    position: fixed;
    inset: 0;
    z-index: 120;
    display: grid;
    place-items: center;
    text-align: center;
    padding: 24px;
    color: var(--fg);
    font-size: clamp(16px, 3vh, 26px);
    background: rgba(0, 0, 0, 0.3);
    pointer-events: none;
  }

  .game-over-overlay :global(strong) {
    display: inline-block;
    margin-top: 4px;
    letter-spacing: 6px;
    color: var(--danger);
    font-size: 1.2em;
  }
</style>
