import type { Secret } from '$lib/types';

// Secret achievements are not tied to click thresholds.
export const SECRETS: Secret[] = [
  { id: 's-held', title: 'maintien prolongé', desc: 'tu as tenu le clic longtemps' },
  { id: 's-right', title: 'clic droit', desc: 'très drôle' },
  { id: 's-konami', title: 'la vieille école', desc: 'haut haut bas bas gauche droite gauche droite b a' },
  { id: 's-afk', title: 'tu es parti', desc: 'mais tu es revenu' },
  { id: 's-returned', title: 'de retour', desc: 'content de te revoir' },
  { id: 's-reset', title: 'effacer', desc: "partir, c'est mourir un peu" },
  { id: 's-click-button', title: 'obéissance', desc: 'tu as appuyé sur le bouton' },
  { id: 's-click-nothing', title: 'patience infinie', desc: '40 clics sans rien toucher' },
  { id: 's-obeyed-not', title: 'désobéissance', desc: "tu as appuyé alors qu'on te disait de ne pas le faire" },
];
