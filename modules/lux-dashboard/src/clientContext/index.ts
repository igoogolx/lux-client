export const isElectron = window.IS_ELECTRON_ENV;

export const elevate = async () => {
  if (isElectron) {
    await window.elevate?.();
  }
};

export const exit = async () => {
  if (isElectron) {
    window.exit?.();
  }
};

export const restart = async () => {
  if (isElectron) {
    window.restart?.();
  }
};

export const shellOpenPath = async (path: string) => {
  if (isElectron) {
    await window.shellOpenPath?.(path);
  }
};

export const shellOpenExternal = (path: string) => {
  if (isElectron) {
    window.shellOpenExternal?.(path);
  } else {
    window.open(path);
  }
};
