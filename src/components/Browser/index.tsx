import {
  startUrl,
  features,
  focusList,
  screenRect,
  rectOffset,
  historyList,
  innerOffset,
  windowOffset
} from "./utils";

import { OS } from "@/app";
import CSS from "./Browser.module.css";
import { Emitter } from "@/utils/Events";
import { Window } from "@/components/Window";

import Arrow from "@/assets/icons/Browser/arrow.svg";
import Reload from "@/assets/icons/Browser/reload.svg";
import Search from "@/assets/icons/Browser/search.svg";
import { For, batch, createSignal, onCleanup } from "solid-js";
import { MinRect, createWindows, disposeWindow } from "@/components/Window/utils";

export const Browser = () =>
{
  let browserId = 0.0;
  let searching = false;

  const views: Record<string, Window> = {};
  const [rect, setRect] = createSignal(MinRect);
  const [windows, setWindows] = createWindows([]);

  const [online, setOnline] = createSignal(navigator.onLine);
  const updateConnection = () => setOnline(navigator.onLine);

  const onMinimize = (rect: Rectangle, id?: string) =>
    OS.Electron?.updateBrowser(id as string, screenRect(rect));

  const onMaximize = (rect: Rectangle, id?: string) =>
    OS.Electron?.updateBrowser(id as string, screenRect(rect));

  const onBlur = (rect: Rectangle, id?: string) =>
    OS.Electron?.updateBrowser(id as string, screenRect(rect));

  const onClick = (window: HTMLElement) => {
    !searching && OS.Electron?.showBrowser(window.id);
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
    views[id].close();

    if (!windows.length) {
      setRect(MinRect);
      browserId = 0.0;
    }
  };

  const onReload = (id: string) => {
    console.log("onReload");
    OS.Electron?.reloadBrowser(id);
  };

  const onSearch = (id: string) =>
    OS.Electron?.searchBrowser(id, historyList.current(id) ?? "");

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

      views[id] = open(
        startUrl, id,
        features(
          rectOffset(
            rect()
          )
        )
      ) as Window;
    });

  const onBackward = void 0;
  const onForward = void 0;

  updateConnection();

  Emitter.add("Browser::Open", onOpen);
  document.addEventListener("Browser::Active", onActive);

  globalThis.addEventListener("online", updateConnection, false);
  globalThis.addEventListener("offline", updateConnection, false);

  onCleanup(() => {
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
          {online() ? (
            <div class={CSS.toolbar}>
              <div class={CSS.buttons}>
                <button
                  onClick={onBackward}
                  title="Backward"
                  classList={{
                  [CSS.disabled]: !historyList.backward(window)
                }}>
                  <Arrow />
                </button>

                <button
                  onClick={onForward}
                  title="Forward"
                  classList={{
                  [CSS.disabled]: !historyList.forward(window)
                }}>
                  <Arrow />
                </button>

                <button
                  onClick={() => onReload(window)}
                  title="Reload"
                >
                  <Reload />
                </button>
              </div>

              <div class={CSS.search}>
                <input
                  value={historyList.current(window)}
                  onFocus={() => searching = true}
                  onBlur={() => searching = false}
                  type="text"
                />

                <button
                  onClick={() => onSearch(window)}
                  title="Search"
                >
                  <Search />
                </button>
              </div>
            </div>
          ) : (
            <div class={CSS.offline}>
              <h2>Looks like you're offline...</h2>
              <span>:(</span>
            </div>
          )}
        </Window>
      )}
    </For>
  );
};
