import type { ContextValue, ThemeProps } from "./types";
import { createContext, useContext } from "solid-js";
import { createStore } from "solid-js/store";

const Context = createContext<ContextValue>(
  [{ dark: false }, () => void 0]
);

export const useTheme = () => useContext(Context);

export const ThemeProvider = (props: ThemeProps) =>
{
  const [state, setState] = createStore({
    dark: props.dark ?? false
  });

  const setMode = (dark: boolean) => {
    const style = getComputedStyle(document.documentElement);

    const secondaryHover = style.getPropertyValue("--secondaryHover");
    const primaryHover = style.getPropertyValue("--primaryHover");

    const secondary = style.getPropertyValue("--secondary");
    const primary = style.getPropertyValue("--primary");

    const root = document.documentElement.style;

    root.setProperty("--secondaryHover", primaryHover);
    root.setProperty("--primaryHover", secondaryHover);

    root.setProperty("--secondary", primary);
    root.setProperty("--primary", secondary);

    setState("dark", dark);
  };

  return (
    <Context.Provider value={[state, setMode]}>
      {props.children}
    </Context.Provider>
  );
};
