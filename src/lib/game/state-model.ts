import type { SaveState } from '$lib/types';
import { createInitialSaveState } from './save';

// Runtime-only fields live here; they are intentionally excluded from SaveState.
export interface GameRuntimeState extends SaveState {
  mode: 'story' | 'endless';
  isReplaying: boolean;
}

export const createInitialRuntimeState = (): GameRuntimeState => ({
  ...createInitialSaveState(),
  mode: 'story',
  isReplaying: false,
});

// Hydrate runtime from persisted data while enforcing phase-1 defaults.
export const fromSaveState = (save: SaveState): GameRuntimeState => ({
  clicks: save.clicks,
  unlocked: [...save.unlocked],
  firstSeenAt: save.firstSeenAt,
  lastVisit: save.lastVisit,
  visits: save.visits,
  displayFrozen: Boolean(save.displayFrozen),
  gameOver: Boolean(save.gameOver),
  mode: 'story',
  isReplaying: false,
});

// Persist only serializable gameplay data; runtime helpers are excluded.
export const toSaveState = (runtime: GameRuntimeState): SaveState => ({
  clicks: runtime.clicks,
  unlocked: [...runtime.unlocked],
  firstSeenAt: runtime.firstSeenAt,
  lastVisit: runtime.lastVisit,
  visits: runtime.visits,
  displayFrozen: Boolean(runtime.displayFrozen),
  gameOver: Boolean(runtime.gameOver),
});
