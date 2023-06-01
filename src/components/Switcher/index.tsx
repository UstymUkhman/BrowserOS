import { createSignal } from "solid-js";
import CSS from "./Switcher.module.css";
import type { SwitcherProps } from "./types";

export const Switcher = ({ active }: SwitcherProps) => {
  const [on, toggle] = createSignal(active);
  const onClick = () => toggle(!on());

  return (
    <div onClick={onClick} class={CSS.switcher} classList={{
      [CSS.enabled]: on()
    }}>
      <input type="checkbox" checked={on()} />
    </div>
  );
};
