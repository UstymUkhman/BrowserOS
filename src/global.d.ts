/// <reference types="node" />
/// <reference types="vite/client" />
/// <reference types="vite-plugin-solid-svg/types" />

declare type Application = Window & typeof globalThis & {
  // Browser View Events:
  openBrowserView: (url: string) => void;
  resizeBrowserView: (view?: number) => void;
  closeBrowserView: (view?: number) => void;

  shutdown: () => void;
  electron: boolean;
};

declare const VERSION: string;
