<script lang="ts">
  export let count = 60;

  const stars = Array.from({ length: count }, () => ({
    left: Math.random() * 100,
    top: Math.random() * 100,
    delay: Math.random() * 3,
  }));
</script>

{#each stars as star}
  <div
    class="star"
    style={`left:${star.left}vw;top:${star.top}vh;animation-delay:${star.delay}s;`}
  ></div>
{/each}

<style>
  .star {
    position: absolute;
    width: 2px;
    height: 2px;
    background: white;
    border-radius: 50%;
    opacity: 0;
    animation: twinkle 3s ease-in-out infinite;
  }
</style>
