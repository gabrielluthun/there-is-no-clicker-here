// ============================================================================
// Types domaine
// ----------------------------------------------------------------------------
// Toute la logique du jeu est décrite en data déclarative via ces types.
// Les paliers (`Milestone`) n'exécutent aucun side-effect directement : ils
// portent un descripteur `EffectKind` que le dispatcher (étape 13) traduit en
// appels aux systèmes (state / audio / fx / msg).
// ============================================================================

// -------- Mode de jeu --------

export type GameMode = 'story' | 'endless';

// -------- Sauvegarde persistée --------

export interface SaveState {
  clicks: number;
  unlocked: string[];
  firstSeenAt: number;
  lastVisit: number;
  visits: number;
  displayFrozen?: boolean;
  gameOver?: boolean;
}

// -------- Palier principal (data) --------

export interface Milestone {
  id: string;
  at: number;
  title: string;
  effect: EffectKind;
}

// -------- Palier secret --------

export interface Secret {
  id: string;
  title: string;
  desc: string;
}

// ============================================================================
// Discriminated union des effets
// ----------------------------------------------------------------------------
// Chaque variante décrit *ce qui doit se passer*, pas *comment le faire*.
// Le dispatcher route chaque variante vers le système concerné.
// ============================================================================

/** Entités persistantes posées sur la scène. */
export type StageEntityKind =
  | 'coreDot'
  | 'coreButton'
  | 'critter1'
  | 'critter2'
  | 'critter3'
  | 'plant'
  | 'starField'
  | 'fly'
  | 'matrixRain'
  | 'comet';

/** Éléments de HUD à révéler. */
export type HudElementKind = 'counter' | 'achievementsBtn';

/** Rafales de particules/météo (persistantes une fois débloquées). */
export type FxBurstKind = 'rain' | 'snow';

/** Classes `body.*` appliquées globalement. */
export type BodyModeClass =
  | 'bg-gradient'
  | 'bg-warm'
  | 'bg-chaos'
  | 'cursor-banana'
  | 'cursor-eye'
  | 'wobble'
  | 'pulse'
  | 'dance'
  | 'breathing'
  | 'inverted'
  | 'rotated';

/** Overlays ponctuels. */
export type OverlayKind = 'fakeLoader' | 'split' | 'err404' | 'temptButton';

/** Flags d'état modifiables par les paliers. */
export type StateFlag = 'displayFrozen' | 'gameOver';

/** Variantes visuelles d'une entité (ex. la plante qui fleurit). */
export type EntityVariant =
  | 'coreDotGrow'
  | 'critter1Awake'
  | 'plantLeaf'
  | 'plantFlower';

/** Cibles pour `speakCritter`. */
export type CritterId = 'critter1' | 'critter2' | 'critter3';

export type EffectKind =
  // --- Scène ---
  | { kind: 'spawnEntity'; entity: StageEntityKind }
  | { kind: 'removeEntity'; entity: StageEntityKind }
  | { kind: 'updateEntity'; variant: EntityVariant }
  | { kind: 'speakCritter'; critterId: CritterId; text: string }

  // --- HUD ---
  | { kind: 'revealHud'; element: HudElementKind }

  // --- Messages / toasts ---
  | {
      kind: 'showMsg';
      text: string;
      faint?: boolean;
      big?: boolean;
      typewriter?: boolean;
      /** Durée d'affichage en ms. 0 = persistant. */
      duration?: number;
    }
  | {
      kind: 'showToast';
      text: string;
      secret?: boolean;
      duration?: number;
    }

  // --- Modes globaux sur <body> ---
  | {
      kind: 'addBodyClass';
      className: BodyModeClass;
      /** Si défini, la classe est retirée après N ms. */
      durationMs?: number;
    }
  | { kind: 'removeBodyClass'; className: BodyModeClass }

  // --- Effets visuels globaux ---
  | { kind: 'screenshake' }
  | { kind: 'flashBody'; color: 'red' | 'white' }
  | { kind: 'confetti'; count: number }
  | {
      kind: 'bigText';
      text: string;
      /** Délai avant fadeout (ms). */
      fadeoutAfterMs?: number;
      /** Délai avant suppression (ms). */
      removeAfterMs?: number;
    }

  // --- Rafales persistantes ---
  | { kind: 'spawnFxBurst'; fx: FxBurstKind; count: number }

  // --- Overlays ponctuels ---
  | { kind: 'overlay'; overlay: OverlayKind; label?: string }

  // --- Audio ---
  | { kind: 'startMusic' }

  // --- État ---
  | { kind: 'setFlag'; flag: StateFlag; value: boolean }

  // --- Composition ---
  /** Exécute un effet après un délai (pour enchaînements scénarisés). */
  | { kind: 'delay'; ms: number; then: EffectKind }
  /** Séquence plusieurs effets (exécutés en ordre, chacun immédiat sauf s'il est `delay`). */
  | { kind: 'composite'; steps: EffectKind[] }
  /** Aucune action (palier purement symbolique). */
  | { kind: 'noop' };

// ============================================================================
// Effets éphémères (queue réactive, étape 8)
// ----------------------------------------------------------------------------
// Ces types décrivent les particules/éléments de courte durée gérés par
// `$lib/fx/queue.svelte.ts`. Distincts de `EffectKind` : ce sont des
// *instances* rendues, pas des descripteurs déclaratifs.
// ============================================================================

export type EphemeralFxKind =
  | 'ripple'
  | 'spark'
  | 'clicFloat'
  | 'emojiPop'
  | 'shockwave'
  | 'cursorTrail'
  | 'confetti'
  | 'rainDrop'
  | 'snowflake'
  | 'heart'
  | 'comet'
  | 'bigText'
  | 'err404'
  | 'fakeLoader'
  | 'split'
  | 'matrixCol'
  | 'temptBtn';

export interface EphemeralFx {
  id: number;
  kind: EphemeralFxKind;
  x?: number;
  y?: number;
  text?: string;
  color?: string;
  ttlMs: number;
  /** Propriétés libres pour variantes (emoji choisi, mot aléatoire…). */
  data?: Record<string, unknown>;
}

// ============================================================================
// Phase 2 — Mode infini (stub)
// ----------------------------------------------------------------------------
// Interface réservée pour la génération procédurale après le game-over.
// Aucune implémentation en phase 1.
// ============================================================================

export interface EndlessStrategy {
  /**
   * Retourne l'effet à déclencher au prochain clic en mode infini, ou `null`
   * si rien ne doit se passer à cette itération.
   *
   * @param clicksSinceEndlessStart Clics écoulés depuis l'entrée en mode endless.
   * @param seed Graine pour la génération déterministe.
   */
  next(clicksSinceEndlessStart: number, seed: number): EffectKind | null;
}
