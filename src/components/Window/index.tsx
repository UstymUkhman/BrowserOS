import { useTheme } from "@/theme";
import CSS from "./Window.module.css";
import { createSignal } from "solid-js";
import Icon from "@/assets/icons/Window";
import { MinRect, MaxRect, innerRect } from "./utils";
import type { WindowProps, ClickEvent } from "./types";

export const Window = (
  {
    onMaximize = () => void 0,
    onMinimize = () => void 0,
    onClick = () => void 0,
    onClose = () => void 0,
    onFocus = () => void 0,
    onBlur = () => void 0,
    hideBar = false,
    rect = MinRect,
    children, id,
    title = ""
  }: WindowProps
) => {
  let window: unknown;
  const [theme] = useTheme();
  const mouse = { x: 0.0, y: 0.0 };

  const [top, setTop] = createSignal(rect.y);
  const [drag, setDrag] = createSignal(false);
  const [left, setLeft] = createSignal(rect.x);

  const [fullscreen, setFullscreen] = createSignal(false);
  const [vertical, setVertical] = createSignal(rect.height);
  const [horizontal, setHorizontal] = createSignal(rect.width);

  const dragStart = (event: ClickEvent) => {
    onFocus(window as HTMLElement, id);
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

  const dragStop = () => {
    onBlur(innerRect(false, {
      width: horizontal(),
      height: vertical(),
      x: left(),
      y: top()
    }), id);

    setDrag(false);
  };

  const click = (event: ClickEvent) => {
    event.stopPropagation();
    onClick(window as HTMLElement, id);
  };

  const close = (event: ClickEvent) => {
    event.stopPropagation();
    onClose(id);
  };

  const toggleFullscreen = () => {
    setFullscreen(!fullscreen());

    if (fullscreen()) {
      onMaximize(innerRect(true), id);
      setHorizontal(MaxRect.width);
      setVertical(MaxRect.height);
      setLeft(MaxRect.x);
      setTop(MaxRect.y);
    }

    else {
      setTop(rect.y);
      setLeft(rect.x);
      setVertical(rect.height);
      setHorizontal(rect.width);
      onMinimize(innerRect(), id);
    }
  };

  return (
    <aside
      id={String(id)}
      onclick={click}
      class={CSS.window}
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
                ? theme.dark ? Icon.light.minimize : Icon.dark.minimize
                : theme.dark ? Icon.light.maximize : Icon.dark.maximize
              }
            />

            <img
              src={theme.dark ? Icon.light.close : Icon.dark.close}
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
