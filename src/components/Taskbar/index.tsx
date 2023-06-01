import CSS from "./Taskbar.module.css";
import { Clock } from "@/components/Clock";
import { Switcher } from "@/components/Switcher";
import Shutdown from "@/assets/icons/shutdown.svg";

export const Taskbar = () =>
{
  const app = globalThis as Application;
  const shutdown = () => app.shutdown();

  return (
    <nav class={CSS.taskbar}>
      <div class={CSS.center}>
        <Clock />
      </div>

      <div class={CSS.right} classList={{
        [CSS.shutdown]: app.electron
      }}>
        <Switcher active />

        {app.electron && (
          <button onClick={shutdown}>
            <Shutdown />
          </button>
        )}
      </div>
    </nav>
  );
};
