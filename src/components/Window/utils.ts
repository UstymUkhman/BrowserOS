import type { SetStoreFunction, Store } from "solid-js/store";
import { height } from "@/components/Taskbar";
import { createStore } from "solid-js/store";

export const createWindows = (ids: string[])
  : [Store<string[]>, SetStoreFunction<string[]>] =>
    createStore<string[]>(ids);

export function disposeWindow(windows: string[], id: string): string[] {
  const index = windows.findIndex((window) => window === id);

  if (index > -1.0)
    return windows.slice(0.0, index).concat(windows.slice(index + 1.0));

  console.error(`Window with id "${id}" not found.`);
  return windows;
}

export const MinRect: Rectangle = {
  y: innerHeight * 0.5 - 240.0 + height,
  x: innerWidth * 0.5 - 320.0,

  height: 480.0,
  width: 640.0
};

export const MaxRect: Rectangle = {
  height: innerHeight - height,
  width: innerWidth,

  y: height,
  x: 0.0
};

export const NoRect: Rectangle = {
  height: 0.0,
  width: 0.0,

  y: 0.0,
  x: 0.0
};

export const innerRect = (
  fullscreen = false,
  rect?: Rectangle,
  offset = NoRect
): Rectangle => {
  rect ??= { ...(fullscreen ? MaxRect : MinRect) };

  rect.height -= 26.0 + offset.height;
  rect.width -= 2.0 + offset.width;

  rect.y += 25.0 + offset.y;
  rect.x += 1.0 + offset.x;

  return rect;
};
