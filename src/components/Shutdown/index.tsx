import { OS } from "@/app";
import CSS from "./Shutdown.module.css";
import Icon from "@/assets/icons/Taskbar/shutdown.svg";

export const Shutdown = () => (
  <button
    onClick={() => OS.Electron?.shutdown()}
    class={CSS.shutdown}
    title="Shutdown"
  >
    <Icon />
  </button>
);
