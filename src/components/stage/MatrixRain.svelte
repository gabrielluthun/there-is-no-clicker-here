<script lang="ts">
  export let columns = 16;

  const letters = 'abcdefghijklmnopqrstuvwxyz0123456789'.split('');
  const cols = Array.from({ length: columns }, (_, i) => {
    const text = Array.from(
      { length: 24 },
      () => letters[Math.floor(Math.random() * letters.length)],
    ).join('\n');
    return {
      left: i * 7,
      delay: Math.random() * 2,
      duration: 2 + Math.random() * 2,
      text,
    };
  });
</script>

{#each cols as col}
  <div
    class="matrix-col"
    style={`left:${col.left}vw;animation-delay:${col.delay}s;animation-duration:${col.duration}s;`}
  >
    {col.text}
  </div>
{/each}

<style>
  .matrix-col {
    position: absolute;
    top: -100%;
    color: #00ff88;
    font-size: 14px;
    animation: fall 3s linear infinite;
    white-space: pre-line;
    line-height: 1.1;
  }
</style>
