/// <reference types="node" />
/// <reference types="vite/client" />
/// <reference types="vite-plugin-solid-svg/types" />

/* Electron */ type Rectangle = {
  height: number;
  width: number;
  x: number;
  y: number;
};

declare type Application = Window & typeof globalThis & {
  // Browser View Events:
  openBrowserView: (url: string, bounds: Rectangle) => void;
  resizeBrowserView: (view: number, bounds: Rectangle) => void;
  closeBrowserView: (view: number) => void;

  shutdown: () => void;
  darkMode: boolean;
  electron: boolean;
};

declare const VERSION: string;
