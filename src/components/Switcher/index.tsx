import { useTheme } from "@/theme";
import { createSignal } from "solid-js";
import CSS from "./Switcher.module.css";
import type { SwitcherProps } from "./types";
import Sun from "@/assets/icons/Taskbar/sun.svg";
import Moon from "@/assets/icons/Taskbar/moon.svg";

export const Switcher = ({ active }: SwitcherProps) =>
{
  const onClick = () => setMode(toggle(!on()));
  const [on, toggle] = createSignal(active);
  const [, setMode] = useTheme();

  return (
    <div
      classList={{ [CSS.enabled]: on() }}
      class={CSS.switcher}
      onClick={onClick}
      title="Theme"
    >
      <Sun />
      <Moon />
    </div>
  );
};
