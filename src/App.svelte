<script lang="ts">
  import { onDestroy, onMount } from 'svelte';
  import FxLayer from './components/FxLayer.svelte';
  import Stage from './components/Stage.svelte';
  import AchievementsPanel from './components/panel/AchievementsPanel.svelte';
  import GameOver from './components/overlays/GameOver.svelte';
  import BigText from './components/overlays/BigText.svelte';
  import Err404 from './components/overlays/Err404.svelte';
  import FakeLoader from './components/overlays/FakeLoader.svelte';
  import SplitOverlay from './components/overlays/SplitOverlay.svelte';
  import TemptButton from './components/overlays/TemptButton.svelte';
  import AchievementsBtn from './components/hud/AchievementsBtn.svelte';
  import Counter from './components/hud/Counter.svelte';
  import Message from './components/hud/Message.svelte';
  import Toast from './components/hud/Toast.svelte';
  import { ensureAudioContext } from '$lib/audio/context';
  import { startMusic } from '$lib/audio/music';
  import { sfx } from '$lib/audio/sfx';
  import { clearFxQueue } from '$lib/fx/queue.svelte';
  import {
    spawnComet,
    spawnConfetti,
    spawnClicFloat,
    spawnEmojiPop,
    spawnHeart,
    spawnRain,
    spawnRipple,
    spawnShockwave,
    spawnSnow,
    spawnSparks,
    spawnSplitOverlay,
    spawnErr404,
    spawnFakeLoader,
    spawnTemptButton,
  } from '$lib/fx/spawners';
  import { CORE_BUTTON_LABELS } from '$lib/game/coreButtonLabels';
  import { createClickHandler } from '$lib/game/click-handler';
  import { createDispatcher } from '$lib/game/dispatcher';
  import { MILESTONES } from '$lib/game/milestones';
  import { MURMURS } from '$lib/game/murmurs';
  import { replayUnlockedMilestones } from '$lib/game/replay';
  import { clearSaveState } from '$lib/game/save';
  import { SECRETS } from '$lib/game/secrets';
  import { gameState, hydrateVisitMetadata, incrementClicks, isUnlocked, lockReplay, persistRuntime, unlock } from '$lib/game/state.svelte';
  import { initAfkInput } from '$lib/input/afk';
  import { initHoldInput } from '$lib/input/hold';
  import { initKonamiInput } from '$lib/input/konami';
  import { initResetCodeInput } from '$lib/input/reset-code';
  import { initRightClickInput } from '$lib/input/right-click';
  import type { EffectKind } from '$lib/types';

  // ------------------------ UI State ------------------------
  let achievementsOpen = false;
  let msgVisible = false;
  let msgText = '';
  let msgFaint = false;
  let msgBig = false;
  let msgTypewriter = false;

  let toastVisible = false;
  let toastText = '';
  let toastSecret = false;

  let bigTextVisible = false;
  let bigTextValue = '';
  let bigTextFading = false;

  let splitVisible = false;
  let err404Visible = false;
  let fakeLoaderVisible = false;
  let fakeLoaderLabel = 'chargement de rien';
  let temptVisible = false;

  let showCoreDot = false;
  let coreDotGrown = false;
  let showCoreButton = false;
  let coreButtonLabel = 'ARRÊTER';
  let showCritter1 = false;
  let critter1Awake = false;
  let showCritter2 = false;
  let showCritter3 = false;
  let plantStage: 'hidden' | 'seed' | 'leaf' | 'flower' = 'hidden';
  let showStars = false;
  let showFly = false;
  let showMatrixRain = false;
  let achBtnVisible = false;
  let achBtnRevealed = false;
  let counterVisible = false;

  let msgTimer: ReturnType<typeof setTimeout> | null = null;
  let toastTimer: ReturnType<typeof setTimeout> | null = null;
  let nextMurmurAt = gameState.clicks + 4 + Math.floor(Math.random() * 6);
  let lastClickAt = Date.now();

  const cleanups: Array<() => void> = [];

  const resetMsgTimer = (): void => {
    if (msgTimer) clearTimeout(msgTimer);
    msgTimer = null;
  };
  const resetToastTimer = (): void => {
    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = null;
  };

  const showMsg = (
    text: string,
    opts: { duration?: number; faint?: boolean; big?: boolean; typewriter?: boolean } = {},
  ): void => {
    const { duration = 3000, faint = false, big = false, typewriter = false } = opts;
    msgText = text;
    msgVisible = true;
    msgFaint = faint;
    msgBig = big;
    msgTypewriter = typewriter;

    resetMsgTimer();
    if (duration > 0) {
      msgTimer = setTimeout(() => {
        msgVisible = false;
      }, duration);
    }
  };

  const showToast = (
    text: string,
    opts: { duration?: number; secret?: boolean } = {},
  ): void => {
    const { duration = 2800, secret = false } = opts;
    toastText = text;
    toastSecret = secret;
    toastVisible = true;
    resetToastTimer();
    toastTimer = setTimeout(() => {
      toastVisible = false;
    }, duration);
  };

  const setBodyClass = (className: string, enabled: boolean): void => {
    if (enabled) document.body.classList.add(className);
    else document.body.classList.remove(className);
  };

  const dispatcher = createDispatcher({
    get isMuted() {
      return gameState.isReplaying;
    },
    spawnEntity: (entity) => {
      if (entity === 'coreDot') showCoreDot = true;
      else if (entity === 'coreButton') showCoreButton = true;
      else if (entity === 'critter1') showCritter1 = true;
      else if (entity === 'critter2') showCritter2 = true;
      else if (entity === 'critter3') showCritter3 = true;
      else if (entity === 'plant') plantStage = plantStage === 'hidden' ? 'seed' : plantStage;
      else if (entity === 'starField') showStars = true;
      else if (entity === 'fly') showFly = true;
      else if (entity === 'matrixRain') showMatrixRain = true;
      else if (entity === 'comet') spawnComet();
    },
    removeEntity: (entity) => {
      if (entity === 'coreDot') showCoreDot = false;
    },
    updateEntity: (variant) => {
      if (variant === 'coreDotGrow') coreDotGrown = true;
      else if (variant === 'critter1Awake') critter1Awake = true;
      else if (variant === 'plantLeaf') plantStage = 'leaf';
      else if (variant === 'plantFlower') plantStage = 'flower';
    },
    speakCritter: (_id, text) => {
      showMsg(text, { faint: true, duration: 2400 });
    },
    revealHud: (element) => {
      if (element === 'counter') counterVisible = true;
      if (element === 'achievementsBtn') {
        achBtnVisible = true;
        requestAnimationFrame(() => {
          achBtnRevealed = true;
        });
      }
    },
    showMsg,
    showToast,
    addBodyClass: (klass) => setBodyClass(klass, true),
    removeBodyClass: (klass) => setBodyClass(klass, false),
    screenshake: () => {
      document.body.classList.remove('screenshake');
      void document.body.offsetWidth;
      document.body.classList.add('screenshake');
    },
    flashBody: (color) => {
      const klass = color === 'red' ? 'flash-red' : 'flash-white';
      document.body.classList.remove(klass);
      void document.body.offsetWidth;
      document.body.classList.add(klass);
      setTimeout(() => document.body.classList.remove(klass), color === 'red' ? 400 : 200);
    },
    confetti: (count) => spawnConfetti(count),
    showBigText: (text, opts) => {
      bigTextValue = text;
      bigTextVisible = true;
      bigTextFading = false;
      if (opts?.fadeoutAfterMs != null) {
        setTimeout(() => {
          bigTextFading = true;
        }, opts.fadeoutAfterMs);
      }
      if (opts?.removeAfterMs != null) {
        setTimeout(() => {
          bigTextVisible = false;
          bigTextFading = false;
        }, opts.removeAfterMs);
      }
    },
    spawnFxBurst: (fx, count) => {
      if (fx === 'rain') spawnRain(count);
      else spawnSnow(count);
    },
    showOverlay: (overlay, label) => {
      if (overlay === 'split') {
        splitVisible = true;
        spawnSplitOverlay();
        setTimeout(() => (splitVisible = false), 1200);
      } else if (overlay === 'err404') {
        err404Visible = true;
        spawnErr404();
        setTimeout(() => (err404Visible = false), 1500);
      } else if (overlay === 'fakeLoader') {
        fakeLoaderLabel = label ?? 'chargement de rien';
        fakeLoaderVisible = true;
        spawnFakeLoader(fakeLoaderLabel);
        setTimeout(() => (fakeLoaderVisible = false), 2800);
      } else if (overlay === 'temptButton') {
        temptVisible = true;
        spawnTemptButton();
        setTimeout(() => (temptVisible = false), 6000);
      }
    },
    startMusic: () => {
      startMusic(gameState.isReplaying);
    },
    setFlag: (flag, value) => {
      gameState[flag] = value;
    },
    schedule: (delayMs, run) => {
      setTimeout(run, delayMs);
    },
  });

  const unlockSecret = (id: string): void => {
    const isNew = unlock(id);
    if (!isNew) return;
    persistRuntime();
    const secret = SECRETS.find((s) => s.id === id);
    if (secret && !gameState.isReplaying) {
      sfx.secret(gameState.isReplaying);
      showToast(`secret : ${secret.title}`, { secret: true, duration: 3000 });
    }
  };

  const unlockMilestone = (id: string, effect: EffectKind, title: string): void => {
    const isNew = unlock(id);
    if (!isNew) return;

    dispatcher.dispatch(effect);

    if (!gameState.isReplaying) {
      sfx.milestone(false);
      showToast(title, { duration: 2200 });
    }

    persistRuntime();
  };

  const checkMilestones = (): void => {
    for (const m of MILESTONES) {
      if (gameState.clicks >= m.at && !isUnlocked(m.id)) {
        unlockMilestone(m.id, m.effect, m.title);
      }
    }
  };

  const maybeMurmur = (): void => {
    if (gameState.isReplaying || gameState.displayFrozen || gameState.gameOver) return;
    if (gameState.clicks < 15) return;
    if (gameState.clicks < nextMurmurAt) return;
    if (msgVisible) {
      nextMurmurAt = gameState.clicks + 3;
      return;
    }
    nextMurmurAt = gameState.clicks + 4 + Math.floor(Math.random() * 8);
    const line = MURMURS[Math.floor(Math.random() * MURMURS.length)];
    showMsg(line, { faint: true, duration: 2400 });
  };

  const clickHandler = createClickHandler({
    getClicks: () => gameState.clicks,
    isGameOver: () => Boolean(gameState.gameOver),
    incrementClicks,
    persistRuntime,
    isMusicUnlocked: () => isUnlocked('music'),
    ensureMusicStarted: () => {
      startMusic(gameState.isReplaying);
    },
    playClickSfx: () => sfx.click(gameState.isReplaying),
    checkMilestones,
    maybeMurmur,
    isUnlocked: (id) => isUnlocked(id),
    unlock: (id) => unlockSecret(id),
    spawnSparks,
    spawnRipple,
    spawnClicFloat,
    spawnEmojiPop,
    spawnShockwave,
    spawnHeart,
  });

  const onCoreButtonPress = (): void => {
    clickHandler.handleCoreButtonClick();
    coreButtonLabel = CORE_BUTTON_LABELS[clickHandler.getCoreButtonClicks() % CORE_BUTTON_LABELS.length];
  };

  const onTemptPress = (): void => {
    temptVisible = false;
    showMsg('tu avais UNE consigne.', { faint: true, duration: 2400 });
    setBodyClass('flash-red', true);
    setTimeout(() => setBodyClass('flash-red', false), 400);
    unlockSecret('s-obeyed-not');
  };

  const onGlobalClick = (event: MouseEvent): void => {
    const target = event.target as HTMLElement | null;
    if (target?.closest('#achievements-panel')) return;

    ensureAudioContext();
    lastClickAt = Date.now();
    clickHandler.handleClick(event.clientX, event.clientY);
  };

  onMount(() => {
    hydrateVisitMetadata();
    persistRuntime();

    replayUnlockedMilestones({
      milestones: MILESTONES,
      unlockedIds: gameState.unlocked,
      setReplayLock: (value) => lockReplay(value),
      dispatchEffect: (effect) => dispatcher.dispatch(effect),
    });

    if (gameState.gameOver) {
      setTimeout(() => {
        showMsg(
          "tu voulais un défi, Lucas ?<br>tu l'as.<br><br><span class=\"faint\">maintenant, évalue le jeu.</span><br><br>bisous.<br><br><strong>GAME OVER.</strong>",
          { duration: 0 },
        );
      }, 400);
    } else if (gameState.displayFrozen) {
      setTimeout(() => {
        showMsg(
          "c'est fini. enfin, presque.<br><br><span class=\"faint\">si tu fais quelques clics supplémentaires, il y aura <em>(peut-être)</em> une surprise. mais chut.</span>",
          { duration: 0 },
        );
      }, 600);
    }

    if (gameState.visits >= 2 && gameState.clicks >= 10) {
      setTimeout(() => {
        unlockSecret('s-returned');
        showMsg('— oh. te revoilà.', { faint: true, duration: 2800 });
      }, 800);
    }

    document.addEventListener('click', onGlobalClick);

    cleanups.push(
      initHoldInput({ unlockHeldSecret: () => unlockSecret('s-held') }),
      initRightClickInput({ unlockRightClickSecret: () => unlockSecret('s-right') }),
      initKonamiInput({
        unlockKonamiSecret: () => unlockSecret('s-konami'),
        onKonamiSuccess: () => {
          setBodyClass('rotated', true);
          setTimeout(() => setBodyClass('rotated', false), 20000);
        },
        onToggleAchievementsPanel: () => {
          achievementsOpen = !achievementsOpen;
        },
        onCloseAchievementsPanel: () => {
          achievementsOpen = false;
        },
        canToggleAchievementsPanel: () => isUnlocked('star'),
      }),
      initAfkInput({
        getClicks: () => gameState.clicks,
        getLastClickAt: () => lastClickAt,
        isAfkUnlocked: () => isUnlocked('s-afk'),
        unlockAfkSecret: () => unlockSecret('s-afk'),
        onAfkDetected: () => showMsg('... tu es encore là ?', { faint: true, duration: 3000 }),
      }),
      initResetCodeInput({
        shouldConfirmReset: () => confirm('tout effacer ? (progression, paliers, compteur)'),
        onResetConfirmed: () => {
          unlockSecret('s-reset');
          clearSaveState();
          location.reload();
        },
      }),
    );

    return () => {
      document.removeEventListener('click', onGlobalClick);
      cleanups.forEach((cleanup) => cleanup());
      cleanups.length = 0;
      resetMsgTimer();
      resetToastTimer();
      clearFxQueue();
    };
  });

  onDestroy(() => {
    document.removeEventListener('click', onGlobalClick);
  });
</script>

<Stage
  {showCoreDot}
  {coreDotGrown}
  {showCoreButton}
  {coreButtonLabel}
  {onCoreButtonPress}
  {showCritter1}
  {critter1Awake}
  {showCritter2}
  {showCritter3}
  {plantStage}
  {showStars}
  {showFly}
  {showMatrixRain}
/>

<Message
  text={msgText}
  visible={msgVisible}
  faint={msgFaint}
  big={msgBig}
  typewriter={msgTypewriter}
/>

<Counter clicks={gameState.clicks} revealed={counterVisible} frozenCap={gameState.displayFrozen ? 250 : null} />

<AchievementsBtn
  hidden={!achBtnVisible}
  revealed={achBtnRevealed}
  onClick={() => {
    achievementsOpen = true;
  }}
/>

<AchievementsPanel
  visible={achievementsOpen}
  milestones={MILESTONES}
  secrets={SECRETS}
  unlockedIds={gameState.unlocked}
  onClose={() => {
    achievementsOpen = false;
  }}
/>

<Toast text={toastText} visible={toastVisible} secret={toastSecret} />
<BigText text={bigTextValue} visible={bigTextVisible} fading={bigTextFading} />
<Err404 visible={err404Visible} />
<FakeLoader visible={fakeLoaderVisible} label={fakeLoaderLabel} />
<SplitOverlay visible={splitVisible} />
<TemptButton visible={temptVisible} onPress={onTemptPress} />
<GameOver visible={Boolean(gameState.gameOver)} />

<FxLayer />
