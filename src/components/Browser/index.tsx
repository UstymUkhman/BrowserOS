import { OS } from "@/app";
import CSS from "./Browser.module.css";
import { Emitter } from "@/utils/Events";
import { Window } from "@/components/Window";
import { For, batch, createSignal, onCleanup } from "solid-js";
import { MinRect, createWindows, disposeWindow } from "@/components/Window/utils";
import { url, offset, features, focusList, screenRect, rectOffset } from "./utils";

export const Browser = (_: object, browserId = 0) =>
{
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

    focusList.remove(id);
    views[id].close();

    if (!windows.length) {
      setRect(MinRect);
      browserId = 0.0;
    }
  };

  const onOpen = () => !OS.Electron
    ? open(url, "_blank", features()) : batch(() => {
      const { x: u, y: v, width, height } = rect();
      const visibleOffset = +!!windows.length;

      const x = u + visibleOffset * offset[0];
      const y = v + visibleOffset * offset[1];

      const id = `Browser${browserId++}`;
      setRect({ x, y, width, height });
      setWindows(windows.length, id);
      focusList.add(id);

      views[id] = open(url, id, features(
        rectOffset(rect())
      )) as Window;
    });

  Emitter.add("Browser::Open", onOpen);
  document.addEventListener("Browser::Active", onActive);

  globalThis.addEventListener("online", updateConnection, false);
  globalThis.addEventListener("offline", updateConnection, false);

  onCleanup(() => {
    focusList.dispose();
    Emitter.remove("Browser::Open", onOpen);
    document.removeEventListener("Browser::Active", onActive);

    globalThis.removeEventListener("online", updateConnection, false);
    globalThis.removeEventListener("offline", updateConnection, false);
  });

  updateConnection();

  return (
    <For each={windows}>
      {window => (
        <Window
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
          {!online() && (
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
