import { OS } from "@/app";
import CSS from "./Browser.module.css";
import { Emitter } from "@/utils/Events";
import { Window } from "@/components/Window";
import { url, features, screenRect } from "./utils";
import { For, batch, createSignal, onCleanup } from "solid-js";
import { createWindows, disposeWindow } from "@/components/Window/utils";

export const Browser = (_: object, browserId = 0) =>
{
  const views: Record<string, Window> = {};
  const [windows, setWindows] = createWindows([]);
  // const [rect, setRect] = createSignal(Config.view());

  const [online, setOnline] = createSignal(navigator.onLine);
  const updateConnection = () => setOnline(navigator.onLine);

  const onOpen = () => !OS.Electron
    ? open(url, "_blank", features()) : batch(() => {
      // const offset = +!!windows.length;
      // const { x: u, y: v, width, height } = rect();

      // const x = u + offset * Config.offset[0];
      // const y = v + offset * Config.offset[1];

      const id = `Browser${browserId++}`;
      // setRect({ x, y, width, height });
      setWindows(windows.length, id);

      views[id] = open(url, id, features()) as Window;
    });

  const onFocus = (_: MouseEvent, window: HTMLElement) => {
    windows.forEach(id => {
      const window = document.getElementById(String(id));
      if (window) window.style.zIndex = "";
    });

    window.style.zIndex = "1";
  };

  const onMaximize = (rect: Rectangle, id?: string) =>
    OS.Electron?.updateBrowser(id as string, screenRect(rect));

  const onMinimize = (rect: Rectangle, id?: string) =>
    OS.Electron?.updateBrowser(id as string, screenRect(rect));

  const onClose = (id?: string) => {
    if (!id) return console.error(`Window with id "${String(id)}" not found.`);
    setWindows((windows) => disposeWindow(windows, id));
    if (!windows.length) browserId = 0.0;
    views[id].close();
  };

  Emitter.add("Browser::Open", onOpen);

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
          onFocus={onFocus}
          onClose={onClose}
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
