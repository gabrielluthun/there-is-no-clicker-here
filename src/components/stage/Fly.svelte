<script lang="ts">
  import { onDestroy, onMount } from 'svelte';

  let left = 20;
  let top = 20;
  let timer: ReturnType<typeof setInterval> | null = null;

  onMount(() => {
    // Same behavior as original: random move every ~1.8s.
    timer = setInterval(() => {
      left = Math.random() * 90;
      top = Math.random() * 90;
    }, 1800);
  });

  onDestroy(() => {
    if (timer) clearInterval(timer);
  });
</script>

<div id="fly" class="floater" style={`left:${left}vw;top:${top}vh;`}>🪰</div>

<style>
  .floater {
    position: absolute;
    pointer-events: none;
    font-size: 20px;
    opacity: 0.7;
    animation: float 4s ease-in-out infinite;
  }
</style>
