import type { EffectKind, FxBurstKind } from '$lib/types';

interface MsgOptions {
  duration?: number;
  faint?: boolean;
  big?: boolean;
  typewriter?: boolean;
}

interface ToastOptions {
  duration?: number;
  secret?: boolean;
}

interface BigTextOptions {
  fadeoutAfterMs?: number;
  removeAfterMs?: number;
}

export interface DispatcherContext {
  isMuted: boolean;
  spawnEntity: (entity: string) => void;
  removeEntity: (entity: string) => void;
  updateEntity: (variant: string) => void;
  speakCritter: (critterId: string, text: string) => void;
  revealHud: (element: string) => void;
  showMsg: (text: string, opts?: MsgOptions) => void;
  showToast: (text: string, opts?: ToastOptions) => void;
  addBodyClass: (className: string) => void;
  removeBodyClass: (className: string) => void;
  screenshake: () => void;
  flashBody: (color: 'red' | 'white') => void;
  confetti: (count: number) => void;
  showBigText: (text: string, opts?: BigTextOptions) => void;
  spawnFxBurst: (fx: FxBurstKind, count: number) => void;
  showOverlay: (overlay: string, label?: string) => void;
  startMusic: () => void;
  setFlag: (flag: 'displayFrozen' | 'gameOver', value: boolean) => void;
  schedule: (delayMs: number, run: () => void) => void;
}

/**
 * Routes declarative effects to concrete systems.
 * This is the key bridge between data milestones and runtime side-effects.
 */
export const createDispatcher = (ctx: DispatcherContext) => {
  const dispatch = (effect: EffectKind): void => {
    switch (effect.kind) {
      case 'spawnEntity':
        ctx.spawnEntity(effect.entity);
        return;
      case 'removeEntity':
        ctx.removeEntity(effect.entity);
        return;
      case 'updateEntity':
        ctx.updateEntity(effect.variant);
        return;
      case 'speakCritter':
        if (!ctx.isMuted) ctx.speakCritter(effect.critterId, effect.text);
        return;
      case 'revealHud':
        ctx.revealHud(effect.element);
        return;
      case 'showMsg':
        if (!ctx.isMuted) ctx.showMsg(effect.text, effect);
        return;
      case 'showToast':
        if (!ctx.isMuted) ctx.showToast(effect.text, effect);
        return;
      case 'addBodyClass':
        ctx.addBodyClass(effect.className);
        if (effect.durationMs != null) {
          ctx.schedule(effect.durationMs, () => ctx.removeBodyClass(effect.className));
        }
        return;
      case 'removeBodyClass':
        ctx.removeBodyClass(effect.className);
        return;
      case 'screenshake':
        if (!ctx.isMuted) ctx.screenshake();
        return;
      case 'flashBody':
        if (!ctx.isMuted) ctx.flashBody(effect.color);
        return;
      case 'confetti':
        if (!ctx.isMuted) ctx.confetti(effect.count);
        return;
      case 'bigText':
        if (!ctx.isMuted) ctx.showBigText(effect.text, effect);
        return;
      case 'spawnFxBurst':
        if (!ctx.isMuted) ctx.spawnFxBurst(effect.fx, effect.count);
        return;
      case 'overlay':
        if (!ctx.isMuted) ctx.showOverlay(effect.overlay, effect.label);
        return;
      case 'startMusic':
        if (!ctx.isMuted) ctx.startMusic();
        return;
      case 'setFlag':
        ctx.setFlag(effect.flag, effect.value);
        return;
      case 'delay':
        ctx.schedule(effect.ms, () => dispatch(effect.then));
        return;
      case 'composite':
        effect.steps.forEach((step) => dispatch(step));
        return;
      case 'noop':
        return;
    }
  };

  return { dispatch };
};
