import { createSignal } from "solid-js";
import CSS from "./Switcher.module.css";
import Sun from "@/assets/icons/sun.svg";
import Moon from "@/assets/icons/moon.svg";
import type { SwitcherProps } from "./types";

export const Switcher = ({ active }: SwitcherProps) =>
{
  const [on, toggle] = createSignal(active);
  const onClick = () => toggle(!on());

  return (
    <div onClick={onClick} class={CSS.switcher} classList={{
      [CSS.enabled]: on()
    }}>
      <Sun />
      <Moon />
    </div>
  );
};
