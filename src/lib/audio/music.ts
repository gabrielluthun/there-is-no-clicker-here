import { ensureAudioContext } from './context';

const MELODY = [0, 4, 7, 4, 5, 9, 12, 7, -3, 0, 4, 0, 2, 5, 9, 5] as const;

let isStarted = false;
let intervalId: number | null = null;
let musicPos = 0;
let nextTime = 0;

const scheduleTick = (): void => {
  const ctx = ensureAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  while (nextTime < now + 0.5) {
    const n = MELODY[musicPos % MELODY.length];
    const freq = 220 * Math.pow(2, n / 12);

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, nextTime);

    gain.gain.setValueAtTime(0, nextTime);
    gain.gain.linearRampToValueAtTime(0.03, nextTime + 0.02);
    gain.gain.linearRampToValueAtTime(0.0001, nextTime + 0.35);

    osc.connect(gain).connect(ctx.destination);
    osc.start(nextTime);
    osc.stop(nextTime + 0.4);

    nextTime += 0.4;
    musicPos += 1;
  }
};

/**
 * Starts the procedural background loop once.
 * Returns true if started (or already running), false when AudioContext missing.
 */
export const startMusic = (isMuted = false): boolean => {
  if (isMuted) return false;
  if (isStarted) return true;

  const ctx = ensureAudioContext();
  if (!ctx) return false;

  isStarted = true;
  nextTime = ctx.currentTime + 0.2;
  scheduleTick();
  intervalId = window.setInterval(scheduleTick, 200);
  return true;
};

export const stopMusic = (): void => {
  if (intervalId !== null) {
    window.clearInterval(intervalId);
    intervalId = null;
  }
  isStarted = false;
};

export const isMusicStarted = (): boolean => isStarted;
