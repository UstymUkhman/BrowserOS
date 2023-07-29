import { OS } from "@/app";
import CSS from "./Taskbar.module.css";
import { Clock } from "@/components/Clock";
import { Shutdown } from "@/components/Shutdown";
import { Switcher } from "@/components/Switcher";
import { Applications } from "@/components/Applications";

export const Taskbar = () => (
  <nav class={CSS.taskbar}>
    <Applications />
    <Clock />

    <div class={CSS.right} classList={{
      [CSS.shutdown]: !!OS.Electron
    }}>
      <Switcher />
      {OS.Electron && <Shutdown />}
    </div>
  </nav>
);

export const height = 25.0;
