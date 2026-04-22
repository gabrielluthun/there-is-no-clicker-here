import { describe, expect, it } from 'vitest';
import {
  createInitialRuntimeState,
  fromSaveState,
  toSaveState,
  type GameRuntimeState,
} from '$lib/game/state-model';
import type { SaveState } from '$lib/types';

describe('state-model.ts', () => {
  it('creates a valid initial runtime state', () => {
    const state = createInitialRuntimeState();
    expect(state.clicks).toBe(0);
    expect(state.unlocked).toEqual([]);
    expect(state.mode).toBe('story');
    expect(state.isReplaying).toBe(false);
  });

  it('hydrates runtime state from save state', () => {
    const save: SaveState = {
      clicks: 250,
      unlocked: ['first', 'counter'],
      firstSeenAt: 1,
      lastVisit: 2,
      visits: 3,
      displayFrozen: true,
      gameOver: false,
    };

    const runtime = fromSaveState(save);
    expect(runtime).toEqual({
      ...save,
      mode: 'story',
      isReplaying: false,
    });
  });

  it('serializes runtime state back to save shape', () => {
    const runtime: GameRuntimeState = {
      clicks: 260,
      unlocked: ['first', 'game-over'],
      firstSeenAt: 11,
      lastVisit: 22,
      visits: 9,
      displayFrozen: true,
      gameOver: true,
      mode: 'endless',
      isReplaying: true,
    };

    expect(toSaveState(runtime)).toEqual({
      clicks: 260,
      unlocked: ['first', 'game-over'],
      firstSeenAt: 11,
      lastVisit: 22,
      visits: 9,
      displayFrozen: true,
      gameOver: true,
    });
  });
});
