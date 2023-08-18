import {
  startUrl,
  features,
  rectList,
  focusList,
  screenRect,
  rectOffset,
  innerOffset,
  historyList,
  windowOffset
} from "./utils";

import { OS } from "@/app";
import { Offline } from "./Offline";
import { Toolbar } from "./Toolbar";
import { Emitter } from "@/utils/Events";
import { Window } from "@/components/Window";
import { For, batch, createSignal, onCleanup } from "solid-js";
import { MinRect, createWindows, disposeWindow } from "@/components/Window/utils";

export const Browser = (_: object, browserId = 0) =>
{
  const views: Record<string, Window> = {};
  const [rect, setRect] = createSignal(MinRect);
  const [windows, setWindows] = createWindows([]);

  const [online, setOnline] = createSignal(navigator.onLine);
  const updateConnection = () => setOnline(navigator.onLine);

  const onMinimize = (rect: Rectangle, id?: string) => {
    OS.Electron?.updateBrowser(id as string, screenRect(rect));
    rectList.update(id as string, rect);
  };

  const onMaximize = (rect: Rectangle, id?: string) => {
    OS.Electron?.updateBrowser(id as string, screenRect(rect));
    rectList.update(id as string, rect);
  };

  const onBlur = (rect: Rectangle, id?: string) => {
    OS.Electron?.updateBrowser(id as string, screenRect(rect));
    rectList.update(id as string, rect);
  };

  const onNavigate = (id: string, url: string) => {
    historyList.add(id, url);
    views[id].close();

    views[id] = open(
      url, id,
      features(
        screenRect(
          rectList.get(id)
        )
      )
    ) as Window;
  };

  const onClick = (window: HTMLElement) => {
    OS.Electron?.showBrowser(window.id);
    focus(window);
  };

  const onFocus = (window: HTMLElement) => {
    OS.Electron?.hideBrowsers();
    focus(window);
  };

  const focus = (window: HTMLElement) => {
    windows.forEach(id => {
      const window = document.getElementById(id);
      if (window) window.style.zIndex = "";
    });

    focusList.focus(window.id);
    window.style.zIndex = "1";
  };

  const onActive = (event: Event) => {
    const { detail } = event as CustomEvent;
    const window = focusList.getLast();
    OS.Electron?.hideBrowsers(detail);

    window
      ? onClick(window)
      : focusList.focus(detail);

    windows.forEach(id => {
      const window = document.getElementById(id) as HTMLElement;
      window.style.zIndex = `${+(detail === id) || ""}`;
    });
  };

  const onClose = (id?: string) => {
    if (!id) return console.error(`Window with id "${id}" not found.`);
    setWindows((windows) => disposeWindow(windows, id));

    historyList.remove(id);
    focusList.remove(id);
    rectList.remove(id);
    views[id].close();

    if (!windows.length) {
      setRect(MinRect);
      browserId = 0.0;
    }
  };

  const onOpen = () => !OS.Electron
    ? open(startUrl, "_blank", features()) : batch(() => {
      const { x: u, y: v, width, height } = rect();

      const visibleOffset = +!!windows.length;
      const [offsetX, offsetY] = windowOffset;

      const x = u + visibleOffset * offsetX;
      const y = v + visibleOffset * offsetY;

      const id = `Browser${browserId++}`;
      setRect({ x, y, width, height });
      setWindows(windows.length, id);

      historyList.create(id);
      focusList.add(id);

      rectList.add(
        id, rectOffset(
          rect(),
          false
        )
      );

      views[id] = open(
        startUrl, id,
        features(
          rectOffset(
            rect(),
            true
          )
        )
      ) as Window;
    });

  updateConnection();

  Emitter.add("Browser::Open", onOpen);
  document.addEventListener("Browser::Active", onActive);

  globalThis.addEventListener("online", updateConnection, false);
  globalThis.addEventListener("offline", updateConnection, false);

  onCleanup(() => {
    rectList.dispose();
    focusList.dispose();
    historyList.dispose();

    Emitter.remove("Browser::Open", onOpen);
    document.removeEventListener("Browser::Active", onActive);

    globalThis.removeEventListener("online", updateConnection, false);
    globalThis.removeEventListener("offline", updateConnection, false);
  });

  return (
    <For each={windows}>
      {window => (
        <Window
          innerOffset={innerOffset}
          onMaximize={onMaximize}
          onMinimize={onMinimize}
          onClick={onClick}
          onClose={onClose}
          onFocus={onFocus}
          onBlur={onBlur}
          title="Browser"
          rect={rect()}
          id={window}
        >
          {!online()
            ? <Offline />
            : <Toolbar
                onNavigate={onNavigate}
                onFocus={onClick}
                id={window}
              />
          }
        </Window>
      )}
    </For>
  );
};
