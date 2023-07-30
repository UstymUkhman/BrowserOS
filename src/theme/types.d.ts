import type { JSXElement } from "solid-js";

export type ContextValue = [
  state: { readonly dark: boolean },
  setMode: (dark: boolean) => void
];

export type ThemeProps = {
  children?: JSXElement;
  dark?: boolean;
};
