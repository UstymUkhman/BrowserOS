import { createSignal } from "solid-js";
import CSS from "./Switcher.module.css";
import { Emitter } from "@/utils/Events";
import type { SwitcherProps } from "./types";
import Sun from "@/assets/icons/Taskbar/sun.svg";
import Moon from "@/assets/icons/Taskbar/moon.svg";

export const Switcher = ({ active }: SwitcherProps) =>
{
  const [on, toggle] = createSignal(active);

  const onClick = () =>
    Emitter.dispatch("Theme::Update", !toggle(!on()));

  return (
    <div
      classList={{ [CSS.enabled]: on() }}
      class={CSS.switcher}
      onClick={onClick}
    >
      <Sun />
      <Moon />
    </div>
  );
};
