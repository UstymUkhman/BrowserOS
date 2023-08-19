/// <reference types="node" />
/// <reference types="vite/client" />
/// <reference types="vite-plugin-solid-svg/types" />

declare type System = Window & typeof globalThis & {
  Electron?: {
    reloadBrowser: (id: string) => void;
    hideBrowsers: (id?: string) => void;

    blurBrowser: (id: string) => void;
    showBrowser: (id: string) => void;

    shutdown: () => void;

    updateBrowser: (
      id: string,
      rect: Partial<Rectangle>
    ) => void;
  };
};

declare const APP_DEV: boolean;
declare const VERSION: string;

declare type Rectangle = {
  height: number;
  width: number;
  y: number;
  x: number;
};
