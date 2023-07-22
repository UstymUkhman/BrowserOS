import { createSignal } from "solid-js";
import { Menu } from "@/components/Menu";
import { Emitter } from "@/utils/Events";
import CSS from "./Applications.module.css";

export const Applications = () =>
{
  const [menu, showMenu] = createSignal(false);
  const toggleMenu = () => showMenu(!menu());

  const onBrowserClick = () => {
    Emitter.dispatch("Browser::Open");
    showMenu(false);
  };

  return (
    <div class={CSS.applications}>
      <span onClick={toggleMenu}>Applications</span>
      {menu() && (
        <Menu origin="left" items={[{
          onClick: onBrowserClick,
          title: "Browser"
        }]} />
      )}
    </div>
  );
};
