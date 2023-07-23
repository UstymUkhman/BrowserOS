import { APP } from "@/app";
import CSS from "./Browser.module.css";
import { Emitter } from "@/utils/Events";
import { Config, features } from "./config";
import { Window } from "@/components/Window";
import { DELTA_UPDATE } from "@/utils/Number";
import type { WindowId } from "@/components/Window/types";
import { For, batch, createSignal, onCleanup } from "solid-js";
import { createWindows, disposeWindow } from "@/components/Window/utils";

export const Browser = (_: object, browserId = 0) =>
{
  const [windows, setWindows] = createWindows([]);
  const [rect, setRect] = createSignal(Config.view());

  const [online, setOnline] = createSignal(navigator.onLine);
  const updateConnection = () => setOnline(navigator.onLine);

  const getViewId = (id?: WindowId) => +(id as string).slice(7);

  const onFocus = (_: MouseEvent, window: HTMLElement) => {
    windows.forEach(id => {
      const window = document.getElementById(String(id));
      if (window) window.style.zIndex = "";
    });

    window.style.zIndex = "1";
  };

  const onMaximize = (id?: WindowId) => {
    const taskbarHeight =
      getComputedStyle(document.documentElement)
      .getPropertyValue("--taskbarHeight");

    const taskbar = +taskbarHeight.slice(0, -2);

    setTimeout(() =>
      APP.resizeBrowserView(getViewId(id), {
        height: innerHeight - 27.0,
        width: innerWidth - 2.0,
        y: taskbar + 26.0,
        x: 1.0
      })
    , DELTA_UPDATE);
  };

  const onMinimize = (id?: WindowId) => {
    const { x, y, width, height } = rect();

    setTimeout(() =>
      APP.resizeBrowserView(getViewId(id), {
        height: height - 27.0,
        width: width - 2.0,
        y: y + 26.0,
        x: x + 1.0
      })
    , DELTA_UPDATE);
  };

  const onClose = (id?: WindowId) => {
    setTimeout(() => APP.closeBrowserView(getViewId(id)), DELTA_UPDATE);
    setWindows((windows) => disposeWindow(windows, id));
    if (!windows.length) browserId = 0.0;
  };

  const onOpen = () => !APP.electron
    ? open(Config.url, "_blank", features())
    : batch(() => {
      setRect(Config.view());
      const offset = +!!windows.length;
      const { x: u, y: v, width, height } = rect();

      const x = u + offset * Config.offset[0];
      const y = v + offset * Config.offset[1];

      setTimeout(() =>
        APP.openBrowserView(Config.url, {
          height: height - 27.0,
          width: width - 2.0,
          y: y + 26.0,
          x: x + 1.0
        })
      , DELTA_UPDATE);

      setRect({ x, y, width, height });
      setWindows(windows.length, `Browser${browserId++}`);
    });

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
