import type { SetStoreFunction, Store } from "solid-js/store";
import type { WindowId } from "@/components/Window/types";
import { createStore } from "solid-js/store";

export const createWindows = (ids: WindowId[])
  : [Store<WindowId[]>, SetStoreFunction<WindowId[]>] =>
    createStore<WindowId[]>(ids);

export function disposeWindow(windows: WindowId[], id?: WindowId): WindowId[] {
  const index = windows.findIndex((window) => window === id);

  if (index < 0 || !id)
    console.error(`Window with id "${String(id)}" not found.`);

  return windows.slice(0.0, index).concat(windows.slice(index + 1.0));
}
