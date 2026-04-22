import type { EffectKind, Milestone } from '$lib/types';

const msg = (
  text: string,
  opts: { duration?: number; faint?: boolean; big?: boolean; typewriter?: boolean } = {},
): EffectKind => ({ kind: 'showMsg', text, ...opts });

const toast = (text: string, duration = 2400): EffectKind => ({ kind: 'showToast', text, duration });

const steps = (...effects: EffectKind[]): EffectKind => ({ kind: 'composite', steps: effects });

// Phase 1 story milestones (challenge timeline 1..260).
// No imperative DOM code lives here; dispatcher resolves each effect.
export const MILESTONES: Milestone[] = [
  { at: 1, id: 'first', title: 'le premier clic', effect: { kind: 'spawnEntity', entity: 'coreDot' } },
  { at: 2, id: 'why', title: 'pourquoi ?', effect: msg('... tu continues ?', { faint: true, duration: 2200 }) },
  { at: 3, id: 'sparks', title: 'étincelles', effect: msg('oh. ça brille maintenant.', { faint: true, duration: 2200 }) },
  {
    at: 4,
    id: 'grow',
    title: 'ça grossit',
    effect: steps(
      { kind: 'updateEntity', variant: 'coreDotGrow' },
      msg('il grossit. rien ne le mérite pourtant.', { faint: true, duration: 2400 }),
    ),
  },
  {
    at: 5,
    id: 'button',
    title: 'bouton inutile',
    effect: steps(
      { kind: 'removeEntity', entity: 'coreDot' },
      { kind: 'spawnEntity', entity: 'coreButton' },
    ),
  },
  { at: 6, id: 'ripple', title: 'ondulation', effect: msg('les clics ont des conséquences, dorénavant.', { faint: true, duration: 2400 }) },
  { at: 8, id: 'lies', title: 'le bouton ment', effect: msg('spoiler : le bouton ne fait rien.', { duration: 2600 }) },
  {
    at: 10,
    id: 'counter',
    title: 'comptable',
    effect: steps({ kind: 'revealHud', element: 'counter' }, msg("j'imagine que tu veux savoir combien.", { faint: true, duration: 2500 })),
  },
  {
    at: 12,
    id: 'bg1',
    title: 'un peu de couleur',
    effect: steps({ kind: 'addBodyClass', className: 'bg-gradient' }, msg("bon, on va mettre un peu d'ambiance. pour toi.", { faint: true, duration: 2600 })),
  },
  {
    at: 14,
    id: 'critter1',
    title: 'une présence',
    effect: steps({ kind: 'spawnEntity', entity: 'critter1' }, msg("il y a quelqu'un.e.", { faint: true, duration: 2400 })),
  },
  { at: 16, id: 'trail', title: 'traînée', effect: toast('le curseur laisse une trace', 2200) },
  {
    at: 18,
    id: 'hello',
    title: 'ça parle',
    effect: steps({ kind: 'updateEntity', variant: 'critter1Awake' }, msg('— oh. salut.', { faint: true, duration: 2400 })),
  },
  {
    at: 20,
    id: 'warm',
    title: 'tiédeur',
    effect: steps(
      { kind: 'removeBodyClass', className: 'bg-gradient' },
      { kind: 'addBodyClass', className: 'bg-warm' },
      msg("un peu de chaleur. pour te récompenser.<br><span class=\"faint\">(non, c'est un mensonge.)</span>", { duration: 2800 }),
    ),
  },
  {
    at: 22,
    id: 'fifty',
    title: 'déjà ça',
    effect: steps(msg('<span class="line">22 clics.</span><span class="line faint">vraiment impressionnant.</span>', { duration: 2800 }), { kind: 'screenshake' }),
  },
  { at: 25, id: 'rain', title: 'petite pluie', effect: steps({ kind: 'spawnFxBurst', fx: 'rain', count: 40 }, msg('il pleut. sur un jeu.', { faint: true, duration: 2400 })) },
  { at: 28, id: 'warning', title: 'malaise', effect: steps({ kind: 'flashBody', color: 'red' }, { kind: 'delay', ms: 400, then: msg('... approche prudemment.', { faint: true, duration: 1800 }) }) },
  { at: 32, id: 'star', title: 'étoile révélée', effect: steps({ kind: 'revealHud', element: 'achievementsBtn' }, toast('achievements débloqués', 2600)) },
  { at: 37, id: 'emojiclick', title: "explosion d'emojis", effect: toast('parfois, au clic...', 2400) },
  {
    at: 42,
    id: 'century',
    title: 'la réponse',
    effect: steps(
      { kind: 'confetti', count: 120 },
      { kind: 'bigText', text: '42', fadeoutAfterMs: 1500, removeAfterMs: 3500 },
      { kind: 'delay', ms: 800, then: msg('la réponse à la grande question.<br><span class="faint">tu ne sais toujours pas laquelle.</span>', { duration: 3000 }) },
    ),
  },
  { at: 48, id: 'banana', title: 'curseur-banane', effect: steps({ kind: 'addBodyClass', className: 'cursor-banana' }, toast('curseur : banane', 2400)) },
  { at: 54, id: 'clic-float', title: 'onomatopées', effect: toast('clic, clic, clic...', 2400) },
  { at: 60, id: 'critter2', title: 'une seconde présence', effect: steps({ kind: 'spawnEntity', entity: 'critter2' }, { kind: 'speakCritter', critterId: 'critter2', text: '— hm.' }) },
  { at: 66, id: 'plant', title: 'une pousse', effect: steps({ kind: 'spawnEntity', entity: 'plant' }, msg("oh. une plante. <span class=\"faint\">d'où ?</span>", { duration: 2400 })) },
  {
    at: 72,
    id: 'bloom',
    title: 'floraison',
    effect: steps(
      { kind: 'updateEntity', variant: 'plantLeaf' },
      { kind: 'delay', ms: 1200, then: { kind: 'updateEntity', variant: 'plantFlower' } },
    ),
  },
  { at: 80, id: 'wobble', title: 'ça tangue', effect: steps({ kind: 'addBodyClass', className: 'wobble' }, msg('tu peux toujours faire pause, tu sais.', { faint: true, duration: 2600 })) },
  { at: 88, id: 'shockwave', title: 'onde de choc', effect: toast('tous les 10 clics...', 2400) },
  { at: 96, id: 'music', title: 'musique de fond', effect: steps({ kind: 'startMusic' }, toast('musique activée', 2400)) },
  { at: 104, id: 'critter3', title: 'on est trois', effect: steps({ kind: 'spawnEntity', entity: 'critter3' }, { kind: 'speakCritter', critterId: 'critter3', text: '— je suis nouveau.' }) },
  { at: 112, id: 'stars', title: 'étoiles', effect: { kind: 'spawnEntity', entity: 'starField' } },
  { at: 120, id: 'snow', title: 'neige de pixels', effect: steps({ kind: 'spawnFxBurst', fx: 'snow', count: 60 }, msg('il neige. sur du javascript.', { faint: true, duration: 2400 })) },
  { at: 130, id: 'fly', title: 'un.e invité.e', effect: steps({ kind: 'spawnEntity', entity: 'fly' }, msg("une mouche. je l'ai pas invitée.", { faint: true, duration: 2400 })) },
  { at: 140, id: 'split', title: 'fracture', effect: { kind: 'overlay', overlay: 'split' } },
  {
    at: 148,
    id: 'loader',
    title: 'faux chargement',
    effect: steps(
      { kind: 'overlay', overlay: 'fakeLoader', label: 'chargement de rien' },
      { kind: 'delay', ms: 2800, then: msg("... c'était un mensonge.", { faint: true, duration: 2200 }) },
    ),
  },
  {
    at: 155,
    id: 'five',
    title: 'cent-cinquante-cinq',
    effect: steps({ kind: 'bigText', text: '155', fadeoutAfterMs: 1500, removeAfterMs: 3500 }, msg("félicitations. il n’y a rien à gagner.", { faint: true, duration: 2400 })),
  },
  { at: 162, id: 'eye', title: "l'œil qui voit", effect: steps({ kind: 'removeBodyClass', className: 'cursor-banana' }, { kind: 'addBodyClass', className: 'cursor-eye' }, toast('on te regarde', 2400)) },
  { at: 170, id: 'comet', title: 'un passage', effect: steps({ kind: 'spawnEntity', entity: 'comet' }, msg("regarde. tu l'as presque raté.", { faint: true, duration: 2600 })) },
  {
    at: 178,
    id: 'satan',
    title: 'ah',
    effect: steps(
      { kind: 'flashBody', color: 'red' },
      { kind: 'addBodyClass', className: 'inverted', durationMs: 1400 },
      { kind: 'delay', ms: 200, then: msg("tu viens d'invoquer quelque chose.", { duration: 2400 }) },
    ),
  },
  { at: 186, id: 'error', title: '404', effect: steps({ kind: 'overlay', overlay: 'err404' }, { kind: 'delay', ms: 1600, then: msg("erreur : pas d'erreur.", { faint: true, duration: 2200 }) }) },
  {
    at: 194,
    id: 'argue',
    title: 'ils se disputent',
    effect: steps(
      { kind: 'speakCritter', critterId: 'critter1', text: "— c'est toi qui l'a laissé entrer ?" },
      { kind: 'delay', ms: 1400, then: { kind: 'speakCritter', critterId: 'critter2', text: '— non. je croyais que c’était toi.' } },
    ),
  },
  { at: 202, id: 'heart', title: 'cœur flottant', effect: toast('des cœurs, parfois', 2400) },
  { at: 210, id: 'pulse', title: 'pulsation', effect: steps({ kind: 'addBodyClass', className: 'pulse' }, msg("l'écran respire. <span class=\"faint\">et toi ?</span>", { duration: 2600 })) },
  { at: 216, id: 'tempt', title: 'la tentation', effect: { kind: 'overlay', overlay: 'temptButton' } },
  {
    at: 222,
    id: 'thousand',
    title: 'triple deux',
    effect: steps(
      { kind: 'confetti', count: 200 },
      { kind: 'bigText', text: '222', fadeoutAfterMs: 2000, removeAfterMs: 4000 },
      { kind: 'delay', ms: 1200, then: msg('— c’est la fin.', { big: true, duration: 2600 }) },
      { kind: 'delay', ms: 4200, then: msg('(non.)', { faint: true, duration: 2000 }) },
    ),
  },
  { at: 228, id: 'still', title: 'tu es toujours là', effect: msg('tu cliques dans le vide depuis 228 fois.<br><span class="faint">juste pour info.</span>', { duration: 3200 }) },
  { at: 232, id: 'sequence', title: 'séquence', effect: msg('1 · 2 · 3 · 4', { big: true, duration: 2400 }) },
  { at: 236, id: 'matrix', title: 'l33t', effect: steps({ kind: 'spawnEntity', entity: 'matrixRain' }, toast('1337', 2000)) },
  { at: 240, id: 'dry', title: 'humour sec', effect: msg('— bon, à ce stade, c’est plus de l’obstination.', { faint: true, duration: 3200 }) },
  { at: 244, id: 'dance', title: 'tout le monde danse', effect: steps({ kind: 'addBodyClass', className: 'dance' }, toast('ça danse', 2400)) },
  { at: 247, id: 'breathing', title: 'la scène respire', effect: steps({ kind: 'addBodyClass', className: 'breathing' }, msg('inspire. expire. <span class="faint">(le jeu, pas toi.)</span>', { duration: 2800 })) },
  {
    at: 250,
    id: 'end',
    title: 'la vraie fin',
    effect: steps(
      { kind: 'addBodyClass', className: 'bg-chaos' },
      { kind: 'setFlag', flag: 'displayFrozen', value: true },
      { kind: 'confetti', count: 250 },
      { kind: 'delay', ms: 600, then: msg("c'est fini. enfin, presque.<br><br><span class=\"faint\">si tu fais quelques clics supplémentaires, il y aura <em>(peut-être)</em> une surprise. mais chut.</span>", { duration: 0 }) },
    ),
  },
  {
    at: 260,
    id: 'game-over',
    title: 'game over',
    effect: steps(
      { kind: 'setFlag', flag: 'gameOver', value: true },
      { kind: 'addBodyClass', className: 'bg-chaos' },
      { kind: 'delay', ms: 600, then: msg("tu voulais un défi, Lucas ?<br>tu l'as.<br><br><span class=\"faint\">maintenant, évalue le jeu.</span><br><br>bisous.<br><br><strong>GAME OVER.</strong>", { duration: 0 }) },
    ),
  },
];
