export interface ResetCodeDeps {
  code?: string;
  shouldConfirmReset: () => boolean;
  onResetConfirmed: () => void;
}

/**
 * Watches key stream and triggers reset flow when the target code is typed.
 * Default code is "reset" to match original game behavior.
 */
export const initResetCodeInput = (deps: ResetCodeDeps): (() => void) => {
  const code = (deps.code ?? 'reset').toLowerCase();
  let buffer = '';

  const onKeyDown = (event: KeyboardEvent): void => {
    const key = event.key;
    if (key.length !== 1) return;

    buffer += key.toLowerCase();
    // Keep a short rolling window; enough to detect the target token.
    if (buffer.length > 10) buffer = buffer.slice(-10);

    if (!buffer.endsWith(code)) return;
    if (deps.shouldConfirmReset()) deps.onResetConfirmed();
    buffer = '';
  };

  document.addEventListener('keydown', onKeyDown);

  return () => {
    document.removeEventListener('keydown', onKeyDown);
  };
};
