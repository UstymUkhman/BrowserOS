import { APP } from "@/app";
import CSS from "./Taskbar.module.css";
import { Clock } from "@/components/Clock";
import { Shutdown } from "@/components/Shutdown";
import { Switcher } from "@/components/Switcher";

export const Taskbar = () => (
  <nav class={CSS.taskbar}>
    <Clock />

    <div class={CSS.right} classList={{
      [CSS.shutdown]: APP.electron
    }}>
      <Switcher active />
      {APP.electron && <Shutdown />}
    </div>
  </nav>
);
