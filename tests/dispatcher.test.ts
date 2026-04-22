import { describe, expect, it, vi } from 'vitest';
import { createDispatcher, type DispatcherContext } from '$lib/game/dispatcher';
import type { EffectKind } from '$lib/types';

const makeCtx = (): DispatcherContext => ({
  isMuted: false,
  spawnEntity: vi.fn(),
  removeEntity: vi.fn(),
  updateEntity: vi.fn(),
  speakCritter: vi.fn(),
  revealHud: vi.fn(),
  showMsg: vi.fn(),
  showToast: vi.fn(),
  addBodyClass: vi.fn(),
  removeBodyClass: vi.fn(),
  screenshake: vi.fn(),
  flashBody: vi.fn(),
  confetti: vi.fn(),
  showBigText: vi.fn(),
  spawnFxBurst: vi.fn(),
  showOverlay: vi.fn(),
  startMusic: vi.fn(),
  setFlag: vi.fn(),
  schedule: (delayMs, run) => {
    setTimeout(run, delayMs);
  },
});

describe('dispatcher', () => {
  it('dispatches simple effects', () => {
    const ctx = makeCtx();
    const dispatcher = createDispatcher(ctx);

    dispatcher.dispatch({ kind: 'spawnEntity', entity: 'coreDot' });
    dispatcher.dispatch({ kind: 'showToast', text: 'hello' });
    dispatcher.dispatch({ kind: 'setFlag', flag: 'displayFrozen', value: true });

    expect(ctx.spawnEntity).toHaveBeenCalledWith('coreDot');
    expect(ctx.showToast).toHaveBeenCalledWith('hello', { kind: 'showToast', text: 'hello' });
    expect(ctx.setFlag).toHaveBeenCalledWith('displayFrozen', true);
  });

  it('dispatches composite + delay', async () => {
    vi.useFakeTimers();
    const ctx = makeCtx();
    const dispatcher = createDispatcher(ctx);

    const effect: EffectKind = {
      kind: 'composite',
      steps: [
        { kind: 'showMsg', text: 'a' },
        { kind: 'delay', ms: 100, then: { kind: 'showMsg', text: 'b' } },
      ],
    };

    dispatcher.dispatch(effect);
    expect(ctx.showMsg).toHaveBeenCalledTimes(1);
    expect(ctx.showMsg).toHaveBeenCalledWith('a', { kind: 'showMsg', text: 'a' });

    await vi.advanceTimersByTimeAsync(100);
    expect(ctx.showMsg).toHaveBeenCalledTimes(2);
    expect(ctx.showMsg).toHaveBeenLastCalledWith('b', { kind: 'showMsg', text: 'b' });
    vi.useRealTimers();
  });

  it('mutes ephemeral effects when replaying', () => {
    const ctx = makeCtx();
    ctx.isMuted = true;
    const dispatcher = createDispatcher(ctx);

    dispatcher.dispatch({ kind: 'showMsg', text: 'hidden' });
    dispatcher.dispatch({ kind: 'showToast', text: 'hidden' });
    dispatcher.dispatch({ kind: 'confetti', count: 10 });

    expect(ctx.showMsg).not.toHaveBeenCalled();
    expect(ctx.showToast).not.toHaveBeenCalled();
    expect(ctx.confetti).not.toHaveBeenCalled();
  });
});
