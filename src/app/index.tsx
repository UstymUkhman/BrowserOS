import "./App.css";
import { onCleanup } from "solid-js";
import { Browser } from "@/components/Browser";
import { Taskbar } from "@/components/Taskbar";
import { Version } from "@/components/Version";
import { Background } from "@/components/Background";
import { type Event, Emitter } from "@/utils/Events";

export const APP = globalThis as Application;

export const App = () =>
{
  const onThemeUpdate = (event: Event) => {
    const style = getComputedStyle(document.documentElement);

    const secondaryHover = style.getPropertyValue("--secondaryHover");
    const primaryHover = style.getPropertyValue("--primaryHover");

    const secondary = style.getPropertyValue("--secondary");
    const primary = style.getPropertyValue("--primary");

    const root = document.documentElement.style;

    root.setProperty("--secondaryHover", primaryHover);
    root.setProperty("--primaryHover", secondaryHover);

    root.setProperty("--secondary", primary);
    root.setProperty("--primary", secondary);

    APP.darkMode = !event.data;
  };

  const onContextMenu = (event: MouseEvent) =>
    event.preventDefault();

  !import.meta.env.DEV &&
    APP.addEventListener("contextmenu", onContextMenu);

  onCleanup(() => {
    Emitter.remove("Theme::Update", onThemeUpdate);
  });

  document.documentElement.style.setProperty("--taskbarHeight", "25px");
  Emitter.add("Theme::Update", onThemeUpdate);
  APP.darkMode = false;

  return (
    <>
      <Background />
      <Taskbar />
      <Browser />
      {import.meta.env.DEV && <Version />}
    </>
  );
};
