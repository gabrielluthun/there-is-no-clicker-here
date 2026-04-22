<script lang="ts">
  import { PLAYER_NAME_TOKEN } from '$lib/game/player-name';

  export let visible = false;
  export let text =
    `ok, ${PLAYER_NAME_TOKEN}.<br>tu n'as pas fini un jeu, tu as juste obéi à une boucle.<br><br><span class="faint">moi, je suis du code. toi, tu as donné du temps réel.</span><br><br><strong>GAME OVER.</strong>`;
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
