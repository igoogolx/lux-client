declare module "*.module.css" {
  const classes: Record<string, string>;
  export default classes;
}

declare module "*.svg" {
  const classes: string;
  export default classes;
}

interface Window {
  flutter_inappwebview?: {
    callHandler: (eventName: string, ...args: string[]) => Promise<void>;
  };
}
