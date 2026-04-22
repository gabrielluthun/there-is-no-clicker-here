const PLAYER_NAME_STORAGE_KEY = 'there-is-no-clicker-here.playerFirstName';
export const PLAYER_NAME_TOKEN = '__PLAYER_FIRST_NAME__';

const FALLBACK_PLAYER_NAME = 'toi';

const sanitizeFirstName = (value: string): string => {
  const cleaned = value.trim().replace(/\s+/g, ' ');
  if (!cleaned) return '';
  return cleaned.slice(0, 24);
};

const escapeHtml = (value: string): string =>
  value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');

export const getPlayerFirstName = (): string => {
  if (typeof window === 'undefined') return FALLBACK_PLAYER_NAME;

  const saved = sanitizeFirstName(window.localStorage.getItem(PLAYER_NAME_STORAGE_KEY) ?? '');
  if (saved) return saved;

  let asked = '';
  if (typeof window.prompt === 'function') {
    try {
      asked = window.prompt('Avant de continuer: ton prenom ?') ?? '';
    } catch {
      asked = '';
    }
  }
  const firstName = sanitizeFirstName(asked) || FALLBACK_PLAYER_NAME;
  window.localStorage.setItem(PLAYER_NAME_STORAGE_KEY, firstName);
  return firstName;
};

export const withPlayerFirstName = (text: string, playerFirstName: string): string => {
  const safeName = escapeHtml(sanitizeFirstName(playerFirstName) || FALLBACK_PLAYER_NAME);
  return text.replaceAll(PLAYER_NAME_TOKEN, safeName);
};
