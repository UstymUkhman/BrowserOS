import type { JSXElement } from "solid-js";

export type ClickEvent = MouseEvent & {
  currentTarget: HTMLElement;
  target: Element;
};

export type WindowProps = {
  onMinimize?: (innerRect: Rectangle, id?: string) => unknown;
  onMaximize?: (innerRect: Rectangle, id?: string) => unknown;

  onFocus?: (window: HTMLElement, id?: string) => unknown;
  onBlur?: (innerRect: Rectangle, id?: string) => unknown;

  onClick?: (window: HTMLElement, id?: string) => unknown;
  onClose?: (id?: string) => unknown;

  children?: JSXElement;
  hideBar?: boolean;
  rect?: Rectangle;
  title?: string;
  id?: string;
};
