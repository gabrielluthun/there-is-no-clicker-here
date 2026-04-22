<script lang="ts">
  import type { Milestone, Secret } from '$lib/types';

  export let visible = false;
  export let milestones: Milestone[] = [];
  export let secrets: Secret[] = [];
  export let unlockedIds: string[] = [];
  export let onClose: (() => void) | null = null;

  $: unlocked = new Set(unlockedIds);
  $: unlockedMilestones = milestones.filter((m) => unlocked.has(m.id)).length;
  $: unlockedSecrets = secrets.filter((s) => unlocked.has(s.id)).length;
  $: progressText = `paliers : ${unlockedMilestones}/${milestones.length}   ·   secrets : ${unlockedSecrets}/${secrets.length}`;

  const handleClose = (event: MouseEvent): void => {
    event.stopPropagation();
    onClose?.();
  };
</script>

{#if visible}
  <div id="achievements-panel">
    <div class="panel-header">
      <h2>découvertes</h2>
      <button id="panel-close" type="button" on:click={handleClose}>×</button>
    </div>

    <ul id="achievements-list">
      {#each milestones as m}
        <li class:locked={!unlocked.has(m.id)}>
          <span class="ach-name">{unlocked.has(m.id) ? m.title : '— verrouillé —'}</span>
          <span class="ach-count">{unlocked.has(m.id) ? `@${m.at}` : '@?'}</span>
        </li>
      {/each}

      {#each secrets as s}
        <li class="secret" class:locked={!unlocked.has(s.id)}>
          <span class="ach-name">{unlocked.has(s.id) ? s.title : '???'}</span>
          <span class="ach-count"></span>
        </li>
      {/each}
    </ul>

    <div class="panel-footer">
      <span>{progressText}</span>
    </div>
  </div>
{/if}

<style>
  #achievements-panel {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: min(500px, 92vw);
    max-height: 80vh;
    background: #15151a;
    border: 1px solid #2a2a30;
    color: var(--fg);
    padding: 24px;
    z-index: 100;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.8);
    display: flex;
    flex-direction: column;
  }

  .panel-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
    padding-bottom: 12px;
    border-bottom: 1px solid #2a2a30;
  }

  .panel-header h2 {
    font-size: 16px;
    letter-spacing: 3px;
    text-transform: uppercase;
    color: var(--accent);
    font-weight: normal;
  }

  #panel-close {
    background: transparent;
    border: none;
    color: var(--muted);
    font-size: 24px;
    cursor: pointer;
    line-height: 1;
    padding: 0 4px;
  }

  #panel-close:hover {
    color: var(--fg);
  }

  #achievements-list {
    list-style: none;
    overflow-y: auto;
    flex: 1;
  }

  #achievements-list li {
    padding: 8px 0;
    border-bottom: 1px solid #1a1a1f;
    font-size: 13px;
    display: flex;
    justify-content: space-between;
    gap: 12px;
  }

  #achievements-list li .ach-name {
    color: var(--fg);
  }

  #achievements-list li.locked .ach-name {
    color: var(--muted);
  }

  #achievements-list li.secret.locked .ach-name {
    color: #3a3a42;
    font-style: italic;
  }

  #achievements-list li.secret .ach-name {
    color: var(--secret);
  }

  #achievements-list li .ach-count {
    color: var(--muted);
    font-variant-numeric: tabular-nums;
  }

  .panel-footer {
    padding-top: 12px;
    margin-top: 12px;
    border-top: 1px solid #2a2a30;
    font-size: 12px;
    color: var(--muted);
    letter-spacing: 1px;
  }
</style>
