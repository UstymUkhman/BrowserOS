import { useTheme } from "@/theme";
import CSS from "./Background.module.css";

export const Background = () => (
  <div class={CSS.background} classList={{ [CSS.dark]: useTheme()[0].dark }} />
);
