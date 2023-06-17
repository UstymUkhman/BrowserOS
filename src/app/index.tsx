import "./App.css";
import { onCleanup } from "solid-js";
import { Emitter } from "@/utils/Events";
import { Taskbar } from "@/components/Taskbar";
import { Version } from "@/components/Version";
import { Background } from "@/components/Background";

export const APP = globalThis as Application;

export const App = () =>
{
  const onThemeUpdate = () => {
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
  };

  Emitter.add("Theme::Update", onThemeUpdate);
  onCleanup(() => Emitter.remove("Theme::Update", onThemeUpdate));

  return (
    <>
      <Background />
      <Taskbar />
      {import.meta.env.DEV && <Version />}
    </>
  );
};
