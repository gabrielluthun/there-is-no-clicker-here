import type { EphemeralFx, EphemeralFxKind } from '$lib/types';

interface SpawnFxInput {
  kind: EphemeralFxKind;
  ttlMs: number;
  x?: number;
  y?: number;
  text?: string;
  color?: string;
  data?: Record<string, unknown>;
}

let nextId = 1;

// Shared ephemeral queue rendered by FxLayer.
export const fxQueue = $state<EphemeralFx[]>([]);

export const pushFx = (input: SpawnFxInput): number => {
  const id = nextId++;
  const item: EphemeralFx = { id, ...input };
  fxQueue.push(item);

  // Each ephemeral item self-expires after ttlMs.
  window.setTimeout(() => {
    removeFx(id);
  }, item.ttlMs);

  return id;
};

export const removeFx = (id: number): void => {
  const idx = fxQueue.findIndex((item) => item.id === id);
  if (idx === -1) return;
  fxQueue.splice(idx, 1);
};

export const clearFxQueue = (): void => {
  fxQueue.length = 0;
};
