/// <reference types="node" />
/// <reference types="vite/client" />
/// <reference types="vite-plugin-solid-svg/types" />

declare type Application = Window & typeof globalThis & {
  shutdown: () => void;
  electron: boolean;
};

declare const VERSION: string;
