<script lang="ts">
  export let text = '';
  export let visible = false;
  export let secret = false;
</script>

<div id="toast" class:show={visible} class:secret={secret}>
  {text}
</div>

<style>
  #toast {
    position: fixed;
    top: 60px;
    right: 16px;
    background: #15151a;
    border: 1px solid var(--accent);
    color: var(--accent);
    padding: 10px 16px;
    font-size: 12px;
    letter-spacing: 2px;
    text-transform: uppercase;
    z-index: 40;
    opacity: 0;
    transform: translateX(40px);
    transition: all 0.4s ease;
    pointer-events: none;
    max-width: 80vw;
  }

  #toast.show {
    opacity: 1;
    transform: translateX(0);
  }

  #toast.secret {
    border-color: var(--secret);
    color: var(--secret);
  }
</style>
