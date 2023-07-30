import "./App.css";
import { ThemeProvider } from "@/theme";
import { Browser } from "@/components/Browser";
import { Taskbar } from "@/components/Taskbar";
import { Version } from "@/components/Version";
import { Background } from "@/components/Background";

export const OS = globalThis as System;

export const App = () => {
  const dev = import.meta.env.DEV || APP_DEV;

  const onContextMenu = (event: MouseEvent) =>
    event.preventDefault();

  !dev && OS.addEventListener("contextmenu", onContextMenu);

  return (
    <ThemeProvider>
      <Background />
      <Taskbar />
      <Browser />
      {dev && <Version />}
    </ThemeProvider>
  );
};
