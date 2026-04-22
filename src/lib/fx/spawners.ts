import { CLICK_EMOJIS } from '$lib/game/clickEmojis';
import { CLIC_WORDS } from '$lib/game/clicWords';
import { pushFx } from './queue.svelte';

const randomFrom = <T>(values: readonly T[]): T =>
  values[Math.floor(Math.random() * values.length)];

export const spawnRipple = (x: number, y: number): void => {
  pushFx({ kind: 'ripple', x, y, ttlMs: 800 });
};

export const spawnSparks = (x: number, y: number, n = 5): void => {
  for (let i = 0; i < n; i += 1) {
    const angle = (Math.PI * 2 * i) / n + Math.random() * 0.5;
    const dist = 30 + Math.random() * 30;
    pushFx({
      kind: 'spark',
      x,
      y,
      ttlMs: 650,
      data: { angle, dist, index: i, total: n },
    });
  }
};

export const spawnClicFloat = (x: number, y: number): void => {
  pushFx({
    kind: 'clicFloat',
    x: x + (Math.random() - 0.5) * 30,
    y,
    text: randomFrom(CLIC_WORDS),
    ttlMs: 1300,
  });
};

export const spawnEmojiPop = (x: number, y: number): void => {
  pushFx({
    kind: 'emojiPop',
    x,
    y,
    text: randomFrom(CLICK_EMOJIS),
    ttlMs: 1500,
  });
};

export const spawnShockwave = (x: number, y: number): void => {
  pushFx({ kind: 'shockwave', x, y, ttlMs: 1000 });
};

let lastTrailAt = 0;
export const spawnCursorTrail = (x: number, y: number): void => {
  const now = performance.now();
  if (now - lastTrailAt < 40) return;
  lastTrailAt = now;
  pushFx({ kind: 'cursorTrail', x, y, ttlMs: 600 });
};

export const spawnRain = (count = 30): void => {
  for (let i = 0; i < count; i += 1) {
    pushFx({
      kind: 'rainDrop',
      x: Math.random() * window.innerWidth,
      y: -20,
      ttlMs: 4000,
      data: {
        durationSec: 0.6 + Math.random() * 0.5,
        delaySec: Math.random() * 2,
      },
    });
  }
};

export const spawnSnow = (count = 50): void => {
  for (let i = 0; i < count; i += 1) {
    pushFx({
      kind: 'snowflake',
      x: Math.random() * window.innerWidth,
      y: -20,
      text: randomFrom(['❄', '*', '·', '.']),
      ttlMs: 9000,
      data: {
        durationSec: 4 + Math.random() * 4,
        delaySec: Math.random() * 4,
      },
    });
  }
};

export const spawnComet = (): void => {
  pushFx({ kind: 'comet', text: '☄', ttlMs: 3600 });
};

export const spawnHeart = (x?: number): void => {
  const px = x == null ? Math.random() * window.innerWidth : x;
  pushFx({
    kind: 'heart',
    x: px,
    y: window.innerHeight,
    text: randomFrom(['♥', '♡', '💛', '💚', '💙']),
    ttlMs: 4100,
  });
};

export const spawnConfetti = (count = 80): void => {
  const colors = ['#f9d35c', '#58e0c0', '#ff5470', '#b56dff', '#ffffff'];
  for (let i = 0; i < count; i += 1) {
    pushFx({
      kind: 'confetti',
      x: Math.random() * window.innerWidth,
      y: -20,
      color: colors[i % colors.length],
      ttlMs: 3400,
      data: {
        dx: (Math.random() - 0.5) * 300,
        rotate: Math.random() * 360,
      },
    });
  }
};

export const spawnBigText = (text: string, ttlMs = 3500): void => {
  pushFx({ kind: 'bigText', text, ttlMs });
};

export const spawnErr404 = (): void => {
  pushFx({ kind: 'err404', text: '404', ttlMs: 1500 });
};

export const spawnSplitOverlay = (): void => {
  pushFx({ kind: 'split', ttlMs: 1200 });
};

export const spawnFakeLoader = (label = 'chargement de rien'): void => {
  pushFx({ kind: 'fakeLoader', text: label, ttlMs: 2800 });
};

export const spawnTemptButton = (): void => {
  pushFx({ kind: 'temptBtn', text: 'NE PAS APPUYER', ttlMs: 6000 });
};

export const spawnMatrixRain = (columns = 16): void => {
  const letters = 'abcdefghijklmnopqrstuvwxyz0123456789'.split('');
  for (let i = 0; i < columns; i += 1) {
    const text = Array.from({ length: 24 }, () => randomFrom(letters)).join('\n');
    pushFx({
      kind: 'matrixCol',
      x: i * 7 * (window.innerWidth / 100),
      y: -20,
      text,
      ttlMs: 6000,
      data: {
        delaySec: Math.random() * 2,
        durationSec: 2 + Math.random() * 2,
      },
    });
  }
};
