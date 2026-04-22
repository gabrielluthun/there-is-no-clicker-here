import { describe, expect, it, vi } from 'vitest';
import { SAVE_KEY, clearSaveState, loadSaveState, persistSaveState } from '$lib/game/save';
import type { SaveState } from '$lib/types';

const makeStorage = () => {
  const store = new Map<string, string>();
  const storage: Storage = {
    get length() {
      return store.size;
    },
    clear() {
      store.clear();
    },
    getItem(key: string) {
      return store.has(key) ? store.get(key)! : null;
    },
    key(index: number) {
      return Array.from(store.keys())[index] ?? null;
    },
    removeItem(key: string) {
      store.delete(key);
    },
    setItem(key: string, value: string) {
      store.set(key, value);
    },
  };
  return storage;
};

const sampleState: SaveState = {
  clicks: 42,
  unlocked: ['first', 'counter'],
  firstSeenAt: 1000,
  lastVisit: 2000,
  visits: 3,
  displayFrozen: false,
  gameOver: false,
};

describe('save.ts', () => {
  it('persist + load returns sanitized state', () => {
    const storage = makeStorage();
    expect(persistSaveState(sampleState, storage)).toBe(true);

    const loaded = loadSaveState(storage);
    expect(loaded).toEqual(sampleState);
  });

  it('returns null when payload is invalid', () => {
    const storage = makeStorage();
    storage.setItem(SAVE_KEY, JSON.stringify({ clicks: 'bad' }));
    expect(loadSaveState(storage)).toBeNull();
  });

  it('clear removes stored state', () => {
    const storage = makeStorage();
    persistSaveState(sampleState, storage);
    expect(loadSaveState(storage)).not.toBeNull();

    expect(clearSaveState(storage)).toBe(true);
    expect(loadSaveState(storage)).toBeNull();
  });

  it('handles storage read failures gracefully', () => {
    const brokenStorage: Storage = {
      get length() {
        return 0;
      },
      clear: vi.fn(),
      getItem: () => {
        throw new Error('boom');
      },
      key: () => null,
      removeItem: vi.fn(),
      setItem: vi.fn(),
    };

    expect(loadSaveState(brokenStorage)).toBeNull();
  });
});
