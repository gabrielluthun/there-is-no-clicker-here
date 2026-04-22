<script lang="ts">
  export let id = '';
  export let emoji = '◉';
  export let left = 50;
  export let top = 50;
  export let color = 'var(--fg)';
  export let fontSize = 24;
</script>

<div
  class="critter"
  {id}
  style={`left:${left}%;top:${top}%;color:${color};font-size:${fontSize}px;`}
>
  {emoji}
</div>

<style>
  .critter {
    position: absolute;
    pointer-events: none;
    transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  }
</style>
