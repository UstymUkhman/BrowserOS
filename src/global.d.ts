/// <reference types="node" />
/// <reference types="vite/client" />
/// <reference types="vite-plugin-solid-svg/types" />

type BrowserId = symbol | string | number;
import type { Rectangle } from "electron";

declare type Application = Window & typeof globalThis & {
  darkMode: boolean;

  electron?: {
    updateBrowser: (id: BrowserId, rect: Rectangle) => void;
    shutdown: () => void;
  };
};

declare const VERSION: string;
