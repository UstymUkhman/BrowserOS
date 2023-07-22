import type { JSXElement } from "solid-js";

type Origin = "left" | "center" | "right";

type MenuItem = {
  title?: string;
  component?: JSXElement;
  onClick?: (event: MouseEvent) => unknown;
};

export type MenuProps = {
  canHover?: boolean;
  items: MenuItem[]
  origin?: Origin;
};
