import { describe, expect, it, vi } from 'vitest';
import { createClickHandler, type ClickHandlerDeps } from '$lib/game/click-handler';

interface FakeState {
  clicks: number;
  unlocked: Set<string>;
  gameOver: boolean;
}

const makeDeps = (state: FakeState): ClickHandlerDeps => ({
  getClicks: () => state.clicks,
  isGameOver: () => state.gameOver,
  incrementClicks: () => {
    state.clicks += 1;
  },
  persistRuntime: vi.fn(),
  isMusicUnlocked: () => state.unlocked.has('music'),
  ensureMusicStarted: vi.fn(),
  playClickSfx: vi.fn(),
  checkMilestones: vi.fn(),
  maybeMurmur: vi.fn(),
  isUnlocked: (id) => state.unlocked.has(id),
  unlock: (id) => {
    state.unlocked.add(id);
  },
  spawnSparks: vi.fn(),
  spawnRipple: vi.fn(),
  spawnClicFloat: vi.fn(),
  spawnEmojiPop: vi.fn(),
  spawnShockwave: vi.fn(),
  spawnHeart: vi.fn(),
});

describe('click-handler', () => {
  it('increments click count and runs core lifecycle', () => {
    const state: FakeState = { clicks: 0, unlocked: new Set(), gameOver: false };
    const deps = makeDeps(state);
    const handler = createClickHandler(deps);

    handler.handleClick(10, 20);

    expect(state.clicks).toBe(1);
    expect(deps.checkMilestones).toHaveBeenCalled();
    expect(deps.maybeMurmur).toHaveBeenCalled();
    expect(deps.persistRuntime).toHaveBeenCalled();
  });

  it('does nothing when game is over', () => {
    const state: FakeState = { clicks: 99, unlocked: new Set(), gameOver: true };
    const deps = makeDeps(state);
    const handler = createClickHandler(deps);

    handler.handleClick(10, 20);
    expect(state.clicks).toBe(99);
    expect(deps.persistRuntime).not.toHaveBeenCalled();
  });

  it('triggers click effects based on unlocked ids', () => {
    const state: FakeState = {
      clicks: 10,
      unlocked: new Set(['sparks', 'ripple', 'clic-float', 'emojiclick']),
      gameOver: false,
    };
    const deps = makeDeps(state);
    const handler = createClickHandler(deps);

    handler.handleClick(40, 50); // goes from 10 to 11 -> emoji pop threshold

    expect(deps.spawnSparks).toHaveBeenCalledWith(40, 50);
    expect(deps.spawnRipple).toHaveBeenCalledWith(40, 50);
    expect(deps.spawnClicFloat).toHaveBeenCalledWith(40, 50);
    expect(deps.spawnEmojiPop).toHaveBeenCalledWith(40, 50);
  });

  it('core button click unlocks obedience secret and counts as click', () => {
    const state: FakeState = { clicks: 0, unlocked: new Set(), gameOver: false };
    const deps = makeDeps(state);
    const handler = createClickHandler(deps);

    handler.handleCoreButtonClick();

    expect(state.unlocked.has('s-click-button')).toBe(true);
    expect(state.clicks).toBe(1);
    expect(handler.getCoreButtonClicks()).toBe(1);
  });
});
