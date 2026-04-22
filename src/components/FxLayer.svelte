<script lang="ts">
  import { fxQueue } from '$lib/fx/queue.svelte';
  import type { EphemeralFx } from '$lib/types';

  const toStyle = (fx: EphemeralFx): string => {
    const left = fx.x != null ? `left:${fx.x}px;` : '';
    const top = fx.y != null ? `top:${fx.y}px;` : '';
    const color = fx.color ? `background:${fx.color};` : '';
    return `${left}${top}${color}`;
  };
</script>

<!--
  Shared renderer for ephemeral effects.
  This is generic; specialized stage/hud/overlay components will
  progressively replace direct class-based rendering in later steps.
-->
{#each fxQueue as fx (fx.id)}
  <div class={`fx fx-${fx.kind}`} style={toStyle(fx)} aria-hidden="true">
    {#if fx.text}{fx.text}{/if}
  </div>
{/each}

<style>
  .fx {
    position: fixed;
    pointer-events: none;
    z-index: 45;
  }

  .fx-ripple {
    border: 2px solid rgba(255, 255, 255, 0.6);
    border-radius: 50%;
    animation: ripple-anim 0.7s ease-out forwards;
  }

  .fx-spark {
    width: 4px;
    height: 4px;
    background: var(--accent);
    border-radius: 50%;
    box-shadow: 0 0 6px var(--accent);
  }

  .fx-clicFloat {
    color: var(--muted);
    font-size: 11px;
    letter-spacing: 1px;
    animation: clic-rise 1.2s ease-out forwards;
  }

  .fx-emojiPop {
    font-size: 24px;
    animation: emoji-fly 1.4s cubic-bezier(.2, .8, .3, 1) forwards;
  }

  .fx-shockwave {
    border: 3px solid var(--accent);
    border-radius: 50%;
    animation: shockwave-anim 0.9s ease-out forwards;
  }

  .fx-cursorTrail {
    width: 6px;
    height: 6px;
    background: rgba(249, 211, 92, 0.5);
    border-radius: 50%;
    animation: trail-fade 0.6s ease-out forwards;
  }

  .fx-confetti {
    width: 8px;
    height: 8px;
  }

  .fx-rainDrop {
    width: 2px;
    height: 12px;
    background: rgba(180, 220, 255, 0.4);
  }

  .fx-snowflake,
  .fx-heart,
  .fx-comet,
  .fx-bigText,
  .fx-err404,
  .fx-matrixCol,
  .fx-temptBtn {
    color: var(--fg);
    white-space: pre-line;
  }

  .fx-split {
    inset: 0;
    background:
      linear-gradient(to right, transparent 49.5%, rgba(255, 255, 255, 0.2) 50%, transparent 50.5%),
      linear-gradient(to bottom, transparent 49.5%, rgba(255, 255, 255, 0.2) 50%, transparent 50.5%);
    animation: split-flash 1.2s ease-out forwards;
  }
</style>
