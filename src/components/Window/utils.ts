import type { SetStoreFunction, Store } from "solid-js/store";
import { createStore } from "solid-js/store";

export const createWindows = (ids: string[])
  : [Store<string[]>, SetStoreFunction<string[]>] =>
    createStore<string[]>(ids);

export function disposeWindow(windows: string[], id: string): string[] {
  const index = windows.findIndex((window) => window === id);

  if (index > -1)
    return windows.slice(0.0, index).concat(windows.slice(index + 1.0));

  console.error(`Window with id "${String(id)}" not found.`);
  return windows;
}
