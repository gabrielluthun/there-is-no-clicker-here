export interface AfkInputDeps {
  getClicks: () => number;
  getLastClickAt: () => number;
  isAfkUnlocked: () => boolean;
  unlockAfkSecret: () => void;
  onAfkDetected: () => void;
  afkDelayMs?: number;
  pollMs?: number;
}

/**
 * Detects inactivity after at least one click and unlocks `s-afk`.
 */
export const initAfkInput = (deps: AfkInputDeps): (() => void) => {
  const afkDelayMs = deps.afkDelayMs ?? 45000;
  const pollMs = deps.pollMs ?? 5000;

  const interval = setInterval(() => {
    if (deps.getClicks() === 0) return;
    if (deps.isAfkUnlocked()) return;
    if (Date.now() - deps.getLastClickAt() <= afkDelayMs) return;

    deps.unlockAfkSecret();
    deps.onAfkDetected();
  }, pollMs);

  return () => {
    clearInterval(interval);
  };
};
