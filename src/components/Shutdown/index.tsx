import { APP } from "@/app";
import CSS from "./Shutdown.module.css";
import Icon from "@/assets/icons/Taskbar/shutdown.svg";

export const Shutdown = () => (
  <button
    onClick={() => APP.shutdown()}
    class={CSS.shutdown}
  >
    <Icon />
  </button>
);
