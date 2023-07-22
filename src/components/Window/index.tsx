import { APP } from "@/app";
import CSS from "./Window.module.css";
import Icon from "@/assets/icons/Window";
import { createSignal, onCleanup } from "solid-js";
import { type Event, Emitter } from "@/utils/Events";
import type { WindowProps, ClickEvent } from "./types";

export const Window = (
  {
    height = innerHeight * 0.5 + 2.0,
    width = innerWidth * 0.5 + 2.0,
    y = innerHeight * 0.25 - 1.0,
    x = innerWidth * 0.25 - 1.0,
    onFocus = () => void 0,
    onClose = () => void 0,
    hideBar = false,
    children, id,
    title = ""
  }: WindowProps
) => {
  let window: unknown;

  const mouse = { x: 0.0, y: 0.0 };
  const [top, setTop] = createSignal(y);
  const [left, setLeft] = createSignal(x);

  const [drag, setDrag] = createSignal(false);
  const [dark, setDark] = createSignal(APP.darkMode);
  const [vertical, setVertical] = createSignal(height);

  const [horizontal, setHorizontal] = createSignal(width);
  const [fullscreen, setFullscreen] = createSignal(false);
  const onThemeUpdate = (event: Event) => setDark(!event.data);

  const onWindowClick = (event: ClickEvent) =>
    onFocus(event, window as HTMLElement, id);

  const dragStart = (event: ClickEvent) => {
    if (fullscreen()) return;
    mouse.x = event.clientX;
    mouse.y = event.clientY;
    setDrag(true);
  };

  const dragMove = (event: ClickEvent) => {
    if (!drag()) return;
    let { x, y } = mouse;

    mouse.x = event.clientX;
    mouse.y = event.clientY;

    x = event.clientX - x;
    y = event.clientY - y;

    setLeft(left() + x);
    setTop(top() + y);
  };

  const dragStop = () => setDrag(false);

  const close = (event: MouseEvent) => {
    event.stopPropagation();
    onClose(id);
  };

  const toggleFullscreen = () => {
    setFullscreen(!fullscreen());

    if (fullscreen()) {
      const taskbar = +taskbarHeight.slice(0, -2);
      setVertical(innerHeight - taskbar);
      setHorizontal(innerWidth);
      setTop(taskbar);
      setLeft(0);
    }

    else {
      setTop(y);
      setLeft(x);
      setVertical(height);
      setHorizontal(width);
    }
  };

  const taskbarHeight =
    getComputedStyle(document.documentElement)
    .getPropertyValue("--taskbarHeight");

  Emitter.add("Theme::Update", onThemeUpdate);

  onCleanup(() => Emitter.remove("Theme::Update", onThemeUpdate));

  return (
    <aside
      id={String(id)}
      class={CSS.window}
      onclick={onWindowClick}
      ref={window as HTMLElement}
      style={{
        transform: `translate(${left()}px, ${top()}px)`,
        width: `${horizontal()}px`,
        height: `${vertical()}px`
      }}
    >
      {!hideBar && (
        <nav
          onmousedown={dragStart}
          onmousemove={dragMove}
          onmouseout={dragStop}
          onmouseup={dragStop}
          class={CSS.toolbar}
          classList={{
            [CSS.fullscreen]: fullscreen(),
            [CSS.dragging]: drag()
          }}
        >
          <h4>{title}</h4>

          <div class={CSS.buttons}>
            <img
              alt={fullscreen() ? "Minimize" : "Maximize"}
              onclick={toggleFullscreen}
              src={fullscreen()
                ? dark() ? Icon.light.minimize : Icon.dark.minimize
                : dark() ? Icon.light.maximize : Icon.dark.maximize
              }
            />

            <img
              src={dark() ? Icon.light.close : Icon.dark.close}
              onclick={close}
              alt="Close"
            />
          </div>
        </nav>
      )}

      {children}
    </aside>
  );
};
