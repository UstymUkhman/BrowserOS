type ClickEvent = MouseEvent & {
  currentTarget: HTMLElement;
  target: Element;
};

type WindowProps = {
  onFocus?: (event: ClickEvent, window: HTMLElement, id?: string) => unknown;
  onMaximize?: (id?: string) => unknown;
  onMinimize?: (id?: string) => unknown;
  onClose?: (id?: string) => unknown;

  children?: JSXElement;
  hideBar?: boolean;
  title?: string;
  id?: string;

  x?: number;
  y?: number;
  width?: number;
  height?: number;
};
