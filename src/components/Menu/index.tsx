import { For } from "solid-js";
import CSS from "./Menu.module.css";
import type { MenuProps } from "./types";

export const Menu = ({ items, origin = "center", canHover = true }: MenuProps) => (
  <menu type="context" class={CSS.menu} classList={{ [CSS[origin]]: true }}>
    <For each={items}>
      {(item) =>
        <li
          title={item.title}
          onclick={item.onClick}
          classList={{
            [CSS.canHover]: canHover
          }}
        >
          {item.title ?? item.component}
        </li>
      }
    </For>
  </menu>
);
