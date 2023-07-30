import type { JSXElement } from "solid-js";

export type ClickEvent = MouseEvent & {
  currentTarget: HTMLElement;
  target: Element;
};

export type WindowProps = {
  onFocus?: (event: ClickEvent, window: HTMLElement, id?: string) => unknown;
  onMaximize?: (innerRect: Rectangle, id?: string) => unknown;
  onMinimize?: (innerRect: Rectangle, id?: string) => unknown;
  onClose?: (id?: string) => unknown;

  children?: JSXElement;
  hideBar?: boolean;
  rect?: Rectangle;
  title?: string;
  id?: string;
};
