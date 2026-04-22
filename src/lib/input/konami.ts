const KONAMI = [
  'ArrowUp',
  'ArrowUp',
  'ArrowDown',
  'ArrowDown',
  'ArrowLeft',
  'ArrowRight',
  'ArrowLeft',
  'ArrowRight',
  'b',
  'a',
] as const;

export interface KonamiInputDeps {
  unlockKonamiSecret: () => void;
  onKonamiSuccess: () => void;
  onToggleAchievementsPanel: () => void;
  onCloseAchievementsPanel: () => void;
  canToggleAchievementsPanel: () => boolean;
}

/**
 * Handles:
 * - Konami secret sequence
 * - keyboard shortcut "a" to open/close achievements panel
 * - Escape to close panel
 */
export const initKonamiInput = (deps: KonamiInputDeps): (() => void) => {
  let index = 0;

  const onKeyDown = (event: KeyboardEvent): void => {
    const key = event.key;

    if ((key === 'a' || key === 'A') && !(event.ctrlKey || event.metaKey || event.altKey)) {
      if (deps.canToggleAchievementsPanel()) deps.onToggleAchievementsPanel();
    }

    if (key === 'Escape') deps.onCloseAchievementsPanel();

    const expected = KONAMI[index];
    if (key.toLowerCase() === expected.toLowerCase()) {
      index += 1;
      if (index === KONAMI.length) {
        index = 0;
        deps.unlockKonamiSecret();
        deps.onKonamiSuccess();
      }
    } else {
      index = key.toLowerCase() === KONAMI[0].toLowerCase() ? 1 : 0;
    }
  };

  document.addEventListener('keydown', onKeyDown);

  return () => {
    document.removeEventListener('keydown', onKeyDown);
  };
};
