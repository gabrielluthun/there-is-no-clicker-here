import type { Milestone } from '$lib/types';

export interface ReplayDeps {
  milestones: Milestone[];
  unlockedIds: Iterable<string>;
  setReplayLock: (value: boolean) => void;
  dispatchEffect: (effect: Milestone['effect']) => void;
}

/**
 * Re-applies unlocked milestones at startup to rebuild visual state.
 *
 * Critical behavior: replay runs in "silent mode" through the dispatcher context
 * (`isMuted = true`) and with replay lock enabled, so no toast/sfx/confetti or
 * other ephemeral feedback should trigger while hydrating.
 */
export const replayUnlockedMilestones = (deps: ReplayDeps): void => {
  const unlocked = new Set(deps.unlockedIds);

  deps.setReplayLock(true);
  try {
    for (const milestone of deps.milestones) {
      if (!unlocked.has(milestone.id)) continue;
      deps.dispatchEffect(milestone.effect);
    }
  } finally {
    deps.setReplayLock(false);
  }
};
