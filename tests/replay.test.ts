import { describe, expect, it, vi } from 'vitest';
import { replayUnlockedMilestones } from '$lib/game/replay';
import type { Milestone } from '$lib/types';

describe('replayUnlockedMilestones', () => {
  it('replays only unlocked milestones in declaration order', () => {
    const milestones: Milestone[] = [
      { id: 'a', at: 1, title: 'A', effect: { kind: 'noop' } },
      { id: 'b', at: 2, title: 'B', effect: { kind: 'showMsg', text: 'B' } },
      { id: 'c', at: 3, title: 'C', effect: { kind: 'showToast', text: 'C' } },
    ];

    const dispatched: string[] = [];
    replayUnlockedMilestones({
      milestones,
      unlockedIds: ['c', 'a'],
      setReplayLock: () => undefined,
      dispatchEffect: (effect) => {
        dispatched.push(effect.kind);
      },
    });

    // Not order of unlockedIds, but order in MILESTONES declaration.
    expect(dispatched).toEqual(['noop', 'showToast']);
  });

  it('always toggles replay lock on and off', () => {
    const lock = vi.fn();

    replayUnlockedMilestones({
      milestones: [],
      unlockedIds: [],
      setReplayLock: lock,
      dispatchEffect: () => undefined,
    });

    expect(lock).toHaveBeenNthCalledWith(1, true);
    expect(lock).toHaveBeenNthCalledWith(2, false);
  });

  it('unlocks replay lock even when dispatch throws', () => {
    const lock = vi.fn();
    const milestones: Milestone[] = [
      { id: 'a', at: 1, title: 'A', effect: { kind: 'noop' } },
    ];

    expect(() =>
      replayUnlockedMilestones({
        milestones,
        unlockedIds: ['a'],
        setReplayLock: lock,
        dispatchEffect: () => {
          throw new Error('boom');
        },
      }),
    ).toThrow('boom');

    expect(lock).toHaveBeenNthCalledWith(1, true);
    expect(lock).toHaveBeenNthCalledWith(2, false);
  });
});
