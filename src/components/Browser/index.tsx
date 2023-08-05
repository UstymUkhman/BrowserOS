import { OS } from "@/app";
import CSS from "./Browser.module.css";
import { Emitter } from "@/utils/Events";
import { Window } from "@/components/Window";
// import { MinRect } from "@/components/Window/utils";
import { url, /* offset, */ features, screenRect } from "./utils";
import { For, batch, createSignal, onCleanup } from "solid-js";
import { createWindows, disposeWindow } from "@/components/Window/utils";

export const Browser = (_: object, browserId = 0) =>
{
  const views: Record<string, Window> = {};
  // const [rect, setRect] = createSignal(MinRect);
  const [windows, setWindows] = createWindows([]);

  const [online, setOnline] = createSignal(navigator.onLine);
  const updateConnection = () => setOnline(navigator.onLine);

  const onClick = (window: HTMLElement, id?: string) => {
    OS.Electron?.showBrowser(id as string);
    focus(window);
  };

  const onMinimize = (rect: Rectangle, id?: string) =>
    OS.Electron?.updateBrowser(id as string, screenRect(rect));

  const onMaximize = (rect: Rectangle, id?: string) =>
    OS.Electron?.updateBrowser(id as string, screenRect(rect));

  const onBlur = (rect: Rectangle, id?: string) =>
    OS.Electron?.updateBrowser(id as string, screenRect(rect));

  const onFocus = (window: HTMLElement) => {
    OS.Electron?.hideBrowsers();
    focus(window);
  };

  const focus = (window: HTMLElement) => {
    windows.forEach(id => {
      const window = document.getElementById(String(id));
      if (window) window.style.zIndex = "";
    });

    window.style.zIndex = "1";
  };

  const onClose = (id?: string) => {
    if (!id) return console.error(`Window with id "${String(id)}" not found.`);
    setWindows((windows) => disposeWindow(windows, id));
    if (!windows.length) browserId = 0.0;
    views[id].close();
  };

  const onOpen = () => !OS.Electron
    ? open(url, "_blank", features()) : batch(() => {
      // const { x: u, y: v, width, height } = rect();
      // const visibleOffset = +!!windows.length;

      // const x = u + visibleOffset * offset[0];
      // const y = v + visibleOffset * offset[1];

      const id = `Browser${browserId++}`;
      // setRect({ x, y, width, height });
      setWindows(windows.length, id);

      views[id] = open(url, id, features()) as Window;
    });

  Emitter.add("Browser::Open", onOpen);

  document.addEventListener("Browser::Active", (event) =>
    console.log((event as CustomEvent).detail)
  );

  globalThis.addEventListener("online", updateConnection, false);
  globalThis.addEventListener("offline", updateConnection, false);

  onCleanup(() => {
    Emitter.remove("Browser::Open", onOpen);

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
