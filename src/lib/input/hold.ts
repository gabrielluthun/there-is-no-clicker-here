export interface HoldInputDeps {
  unlockHeldSecret: () => void;
  holdMs?: number;
}

/**
 * Unlocks `s-held` when mouse is held down for N milliseconds.
 */
export const initHoldInput = (deps: HoldInputDeps): (() => void) => {
  const holdMs = deps.holdMs ?? 3000;
  let timer: ReturnType<typeof setTimeout> | null = null;

  const clear = (): void => {
    if (!timer) return;
    clearTimeout(timer);
    timer = null;
  };

  const onMouseDown = (): void => {
    clear();
    timer = setTimeout(() => {
      deps.unlockHeldSecret();
    }, holdMs);
  };

  const onMouseUp = (): void => clear();
  const onMouseLeave = (): void => clear();

  document.addEventListener('mousedown', onMouseDown);
  document.addEventListener('mouseup', onMouseUp);
  document.addEventListener('mouseleave', onMouseLeave);

  return () => {
    clear();
    document.removeEventListener('mousedown', onMouseDown);
    document.removeEventListener('mouseup', onMouseUp);
    document.removeEventListener('mouseleave', onMouseLeave);
  };
};
