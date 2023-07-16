import type { JSXElement } from "solid-js";

type Origin = "left" | "center" | "right";

type MenuItem = {
  title?: string;
  component?: JSXElement;
  onClick?: (event: MouseEvent) => unknown;
};

export type MenuProps = {
  items: MenuItem[]
  origin?: Origin;
};
