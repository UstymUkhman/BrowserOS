/// <reference types="node" />
/// <reference types="vite/client" />
/// <reference types="vite-plugin-solid-svg/types" />

declare type System = Window & typeof globalThis & {
  darkMode: boolean;

  Electron?: {
    shutdown: () => void;
    updateBrowser: (
      id: string, rect: Partial<Rectangle>
    ) => void;
  };
};

declare const VERSION: string;

declare type Rectangle = {
  height: number;
  width: number;
  y: number;
  x: number;
};
