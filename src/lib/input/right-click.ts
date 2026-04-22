export interface RightClickInputDeps {
  unlockRightClickSecret: () => void;
}

/**
 * Blocks native context menu and unlocks the right-click secret.
 */
export const initRightClickInput = (deps: RightClickInputDeps): (() => void) => {
  const onContextMenu = (event: MouseEvent): void => {
    event.preventDefault();
    deps.unlockRightClickSecret();
  };

  document.addEventListener('contextmenu', onContextMenu);

  return () => {
    document.removeEventListener('contextmenu', onContextMenu);
  };
};
