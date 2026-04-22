export interface ClickHandlerDeps {
  getClicks: () => number;
  isGameOver: () => boolean;
  incrementClicks: () => void;
  persistRuntime: () => void;
  isMusicUnlocked: () => boolean;
  ensureMusicStarted: () => void;
  playClickSfx: () => void;
  checkMilestones: () => void;
  maybeMurmur: () => void;
  isUnlocked: (id: string) => boolean;
  unlock: (id: string) => void;
  spawnSparks: (x: number, y: number) => void;
  spawnRipple: (x: number, y: number) => void;
  spawnClicFloat: (x: number, y: number) => void;
  spawnEmojiPop: (x: number, y: number) => void;
  spawnShockwave: (x: number, y: number) => void;
  spawnHeart: (x?: number) => void;
}

/**
 * Encapsulates click-time gameplay rules (sfx cadence, click FX cadence,
 * unlock shortcuts) without binding to DOM APIs.
 */
export const createClickHandler = (deps: ClickHandlerDeps) => {
  let localClickCount = 0;
  let coreButtonClicks = 0;

  const applyClickEffects = (x?: number, y?: number): void => {
    if (x == null || y == null) return;

    if (deps.isUnlocked('sparks')) deps.spawnSparks(x, y);
    if (deps.isUnlocked('ripple')) deps.spawnRipple(x, y);
    if (deps.isUnlocked('clic-float')) deps.spawnClicFloat(x, y);
    if (deps.isUnlocked('emojiclick') && deps.getClicks() % 11 === 0) deps.spawnEmojiPop(x, y);
    if (deps.isUnlocked('shockwave') && localClickCount % 10 === 0) deps.spawnShockwave(x, y);
    if (deps.isUnlocked('heart') && deps.getClicks() % 17 === 0) deps.spawnHeart(x);
  };

  const handleClick = (x?: number, y?: number): void => {
    if (deps.isGameOver()) return;

    deps.incrementClicks();
    localClickCount += 1;

    if (deps.getClicks() % 7 === 0) deps.playClickSfx();
    if (deps.isMusicUnlocked()) deps.ensureMusicStarted();

    applyClickEffects(x, y);

    deps.checkMilestones();
    deps.maybeMurmur();
    deps.persistRuntime();

    // Secret: 40 clicks after button unlock without clicking the core button.
    if (!deps.isUnlocked('s-click-button') && deps.getClicks() >= 40 && coreButtonClicks === 0) {
      if (deps.isUnlocked('button')) deps.unlock('s-click-nothing');
    }
  };

  const handleCoreButtonClick = (): void => {
    coreButtonClicks += 1;
    deps.unlock('s-click-button');
    handleClick();
  };

  return {
    handleClick,
    handleCoreButtonClick,
    getCoreButtonClicks: () => coreButtonClicks,
    getLocalClickCount: () => localClickCount,
  };
};
