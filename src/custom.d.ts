declare module "*.module.css" {
  const classes: Record<string, string>;
  export default classes;
}

declare module "*.svg" {
  const classes: string;
  export default classes;
}

declare const ClientChannel:
  | {
      postMessage(message: string): void;
    }
  | undefined;
