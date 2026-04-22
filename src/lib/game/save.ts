import type { SaveState } from '$lib/types';

export const SAVE_KEY = 'thereisnoclicker.v1';

export const createInitialSaveState = (): SaveState => {
  const now = Date.now();
  return {
    clicks: 0,
    unlocked: [],
    firstSeenAt: now,
    lastVisit: now,
    visits: 0,
    displayFrozen: false,
    gameOver: false,
  };
};

// Validate and normalize unknown payloads loaded from localStorage.
// Returning null is intentional: callers can fallback to initial state.
const sanitize = (input: unknown): SaveState | null => {
  if (!input || typeof input !== 'object') return null;
  const data = input as Partial<SaveState>;

  if (typeof data.clicks !== 'number' || Number.isNaN(data.clicks)) return null;
  if (!Array.isArray(data.unlocked) || data.unlocked.some((id) => typeof id !== 'string')) return null;
  if (typeof data.firstSeenAt !== 'number' || Number.isNaN(data.firstSeenAt)) return null;
  if (typeof data.lastVisit !== 'number' || Number.isNaN(data.lastVisit)) return null;
  if (typeof data.visits !== 'number' || Number.isNaN(data.visits)) return null;

  return {
    // Clamp and normalize persisted values to avoid broken runtime state.
    clicks: Math.max(0, Math.floor(data.clicks)),
    unlocked: [...new Set(data.unlocked)],
    firstSeenAt: data.firstSeenAt,
    lastVisit: data.lastVisit,
    visits: Math.max(0, Math.floor(data.visits)),
    displayFrozen: Boolean(data.displayFrozen),
    gameOver: Boolean(data.gameOver),
  };
};

export const loadSaveState = (storage: Storage = localStorage): SaveState | null => {
  try {
    const raw = storage.getItem(SAVE_KEY);
    if (!raw) return null;
    return sanitize(JSON.parse(raw));
  } catch {
    return null;
  }
};

// Returns boolean instead of throwing to keep game boot resilient.
export const persistSaveState = (state: SaveState, storage: Storage = localStorage): boolean => {
  try {
    storage.setItem(SAVE_KEY, JSON.stringify(state));
    return true;
  } catch {
    return false;
  }
};

export const clearSaveState = (storage: Storage = localStorage): boolean => {
  try {
    storage.removeItem(SAVE_KEY);
    return true;
  } catch {
    return false;
  }
};
