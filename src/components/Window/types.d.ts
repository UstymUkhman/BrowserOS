export type WindowId = symbol | string | number;

type ClickEvent = MouseEvent & {
  currentTarget: HTMLElement;
  target: Element;
};

type WindowProps = {
  onFocus?: (event: ClickEvent, window: HTMLElement, id?: WindowId) => unknown;
  onClose?: (id?: WindowId) => unknown;

  children?: JSXElement;
  hideBar?: boolean;
  title?: string;
  id?: WindowId;

  x?: number;
  y?: number;
  width?: number;
  height?: number;
};
