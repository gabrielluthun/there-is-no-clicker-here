import { ensureAudioContext } from './context';

export interface BeepParams {
  freq?: number;
  dur?: number;
  type?: OscillatorType;
  vol?: number;
  slide?: number;
  delay?: number;
}

/**
 * Low-level primitive used by all SFX.
 * `isMuted` lets the replay flow silence ephemeral feedback during hydration.
 */
export const beep = (params: BeepParams = {}, isMuted = false): void => {
  if (isMuted) return;

  const ctx = ensureAudioContext();
  if (!ctx) return;

  const {
    freq = 440,
    dur = 0.08,
    type = 'square',
    vol = 0.08,
    slide = 0,
    delay = 0,
  } = params;

  const t0 = ctx.currentTime + delay;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = type;
  osc.frequency.setValueAtTime(freq, t0);
  if (slide !== 0) {
    osc.frequency.exponentialRampToValueAtTime(Math.max(40, freq + slide), t0 + dur);
  }

  gain.gain.setValueAtTime(vol, t0);
  gain.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);

  osc.connect(gain).connect(ctx.destination);
  osc.start(t0);
  osc.stop(t0 + dur + 0.02);
};

export interface SfxApi {
  click: (isMuted?: boolean) => void;
  milestone: (isMuted?: boolean) => void;
  secret: (isMuted?: boolean) => void;
  bad: (isMuted?: boolean) => void;
}

/**
 * Mirrors original game.js tonal identity.
 */
export const sfx: SfxApi = {
  click: (isMuted = false) => beep({ freq: 620, dur: 0.03, vol: 0.04 }, isMuted),
  milestone: (isMuted = false) => {
    beep({ freq: 523, dur: 0.1 }, isMuted);
    beep({ freq: 784, dur: 0.12, delay: 0.08 }, isMuted);
  },
  secret: (isMuted = false) => {
    beep({ freq: 880, dur: 0.1, type: 'triangle' }, isMuted);
    beep({ freq: 1320, dur: 0.14, type: 'triangle', delay: 0.08 }, isMuted);
  },
  bad: (isMuted = false) => beep({ freq: 180, dur: 0.2, slide: -80, vol: 0.12 }, isMuted),
};
