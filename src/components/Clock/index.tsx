import RAF from "@/utils/RAF";
import CSS from "./Clock.module.css";
import type { ClockProps } from "./types";
import { createSignal, onCleanup } from "solid-js";

export const Clock = ({ showSeconds }: ClockProps) =>
{
  const date = new Date();
  const [time, setTime] = createSignal("");

  const tick = () => {
    let ss = "";
    date.setTime(Date.now());

    const hours = date.getHours();
    const minutes = date.getMinutes();

    const hh = `${hours < 10 && "0" || ""}${hours}`;
    const mm = `${minutes < 10 && "0" || ""}${minutes}`;

    if (showSeconds) {
      const seconds = date.getSeconds();
      ss += `:${seconds < 10 && "0" || ""}${seconds}`;
    }

    setTime(`${hh}:${mm}${ss}`);
  };

  RAF.add(tick);
  RAF.pause = false;

  onCleanup(() => RAF.remove(tick));

  return <span class={CSS.clock}>{time()}</span>;
};
