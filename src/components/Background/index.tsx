import CSS from "./Background.module.css";
import { Event, Emitter } from "@/utils/Events";
import { createSignal, onCleanup } from "solid-js";

export const Background = () =>
{
  const [light, setLight] = createSignal(false);
  const onThemeUpdate = ({ data }: Event) => setLight(!!data);

  Emitter.add("Theme::Update", onThemeUpdate);
  onCleanup(() => Emitter.remove("Theme::Update", onThemeUpdate));

  return <div class={CSS.background} classList={{ [CSS.light]: light() }} />;
};
