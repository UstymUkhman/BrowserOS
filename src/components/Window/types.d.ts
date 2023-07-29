type ClickEvent = MouseEvent & {
  currentTarget: HTMLElement;
  target: Element;
};

type WindowProps = {
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
