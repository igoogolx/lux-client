declare module "*.module.css" {
  const classes: { [key: string]: string };
  export default classes;
}

declare module "*.svg" {
  const classes: string;
  export default classes;
}

declare interface Window {
  elevate?: () => Promise<void>;
  exit?: () => void;
  IS_ELECTRON_ENV?: boolean;
  restart?: () => void;
  shellOpenPath?: (path: string) => Promise<void>;
  shellOpenExternal?: (url: string) => Promise<void>;
  openDevTools?: () => void;
  setClientTheme?: (theme: "system" | "dark" | "light") => Promise<void>;
}
