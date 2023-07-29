import { OS } from "@/app";
import CSS from "./Browser.module.css";
import { Emitter } from "@/utils/Events";
import { Config, features } from "./config";
import { Window } from "@/components/Window";
import { For, batch, createSignal, onCleanup } from "solid-js";
import { createWindows, disposeWindow } from "@/components/Window/utils";

export const Browser = (_: object, browserId = 0) =>
{
  const views: Record<string, Window> = {};
  const [windows, setWindows] = createWindows([]);
  const [rect, setRect] = createSignal(Config.view());

  const [online, setOnline] = createSignal(navigator.onLine);
  const updateConnection = () => setOnline(navigator.onLine);

  const onFocus = (_: MouseEvent, window: HTMLElement) => {
    windows.forEach(id => {
      const window = document.getElementById(String(id));
      if (window) window.style.zIndex = "";
    });

    window.style.zIndex = "1";
  };

  const onMaximize = (id?: string) => {
    const taskbarHeight =
      getComputedStyle(document.documentElement)
      .getPropertyValue("--taskbarHeight");

    const taskbar = +taskbarHeight.slice(0, -2);

    OS.Electron?.updateBrowser(id as string, {
      height: Math.min(innerHeight, 600) - taskbar - 26.0,
      width: Math.min(innerWidth, 800),
      y: screenTop + taskbar + 26.0,
      x: screenLeft
    });
  };

  const onMinimize = (id?: string) => {
    const { x, y, width, height } = rect();

    OS.Electron?.updateBrowser(id as string, {
      y: y + screenTop + 26.0,
      height: height - 26.0,
      x: x + screenLeft,
      width: width
    });
  };

  const onClose = (id?: string) => {
    if (!id) return console.error(`Window with id "${String(id)}" not found.`);
    setWindows((windows) => disposeWindow(windows, id));
    if (!windows.length) browserId = 0.0;
    views[id].close();
  };

  const onOpen = () => {
    batch(() => {
      const offset = +!!windows.length;
      const { x: u, y: v, width, height } = rect();

      const x = u + offset * Config.offset[0];
      const y = v + offset * Config.offset[1];

      const id = `Browser${browserId++}`;
      setRect({ x, y, width, height });
      setWindows(windows.length, id);

      views[id] = open(
        Config.url,
        OS.Electron ? id : "_blank",
        features()
      ) as Window;
    });
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
          height={rect().height}
          width={rect().width}
          onFocus={onFocus}
          onClose={onClose}
          title="Browser"
          x={rect().x}
          y={rect().y}
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
