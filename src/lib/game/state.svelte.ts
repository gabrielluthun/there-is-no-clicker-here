import { fromSaveState, createInitialRuntimeState, toSaveState } from './state-model';
import { loadSaveState, persistSaveState } from './save';

const loaded = loadSaveState();
const base = loaded ? fromSaveState(loaded) : createInitialRuntimeState();

// Central runtime state (Svelte 5 rune store style).
export const gameState = $state(base);

// Derived lookup used by unlock checks; avoids O(n) includes everywhere.
const unlockedSet = $derived(new Set(gameState.unlocked));

export const isUnlocked = (id: string): boolean => unlockedSet.has(id);

export const hydrateVisitMetadata = (): void => {
  gameState.visits += 1;
  gameState.lastVisit = Date.now();
};

export const incrementClicks = (): void => {
  if (gameState.gameOver) return;
  gameState.clicks += 1;
};

export const unlock = (id: string): boolean => {
  if (isUnlocked(id)) return false;
  // Immutable array write keeps updates explicit and traceable.
  gameState.unlocked = [...gameState.unlocked, id];
  return true;
};

export const lockReplay = (value: boolean): void => {
  gameState.isReplaying = value;
};

// Persist a serialized snapshot (runtime-only fields are stripped).
export const persistRuntime = (): boolean => persistSaveState(toSaveState(gameState));
