<script lang="ts">
  import { onDestroy } from 'svelte';

  export let text = '';
  export let visible = false;
  export let faint = false;
  export let big = false;
  export let typewriter = false;

  let rendered = '';
  let timer: ReturnType<typeof setInterval> | null = null;

  const stopTyping = (): void => {
    if (!timer) return;
    clearInterval(timer);
    timer = null;
  };

  $: {
    stopTyping();
    if (!typewriter || !visible) {
      rendered = text;
    } else {
      rendered = '';
      let i = 0;
      timer = setInterval(() => {
        if (i >= text.length) {
          stopTyping();
          return;
        }
        rendered += text[i++];
      }, 35);
    }
  }

  onDestroy(() => {
    stopTyping();
  });
</script>

<div id="msg" class:show={visible} class:faint class:big>
  {#if typewriter}
    <span class="typewriter">{rendered}</span>
  {:else}
    {@html rendered}
  {/if}
</div>

<style>
  #msg {
    position: fixed;
    top: 72%;
    left: 50%;
    transform: translate(-50%, -50%);
    text-align: center;
    max-width: 80vw;
    font-size: clamp(14px, 2.4vh, 22px);
    line-height: 1.6;
    letter-spacing: 0.5px;
    color: var(--fg);
    pointer-events: none;
    z-index: 10;
    opacity: 0;
    transition: opacity 0.6s ease;
  }

  #msg.show {
    opacity: 1;
  }

  #msg.faint {
    color: var(--muted);
  }

  #msg.big {
    font-size: clamp(22px, 5vh, 48px);
    font-weight: bold;
    letter-spacing: 2px;
  }

  .typewriter::after {
    content: '▌';
    margin-left: 2px;
    color: var(--accent);
    animation: blink 1s step-end infinite;
  }
</style>
