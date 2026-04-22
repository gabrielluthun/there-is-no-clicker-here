let audioCtx: AudioContext | null = null;

/**
 * Lazily create the AudioContext on first user interaction.
 * Browsers block audio until a gesture, so callers should invoke this from
 * click/keydown handlers before attempting to play sounds.
 */
export const ensureAudioContext = (): AudioContext | null => {
  if (typeof window === 'undefined') return null;

  if (!audioCtx) {
    try {
      const Ctx = window.AudioContext || (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      audioCtx = Ctx ? new Ctx() : null;
    } catch {
      audioCtx = null;
    }
  }

  if (audioCtx && audioCtx.state === 'suspended') {
    void audioCtx.resume();
  }

  return audioCtx;
};

export const getAudioContext = (): AudioContext | null => audioCtx;
