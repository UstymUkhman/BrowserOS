import type { Rectangle } from "electron";
import { Browser } from "../src/config";

export default
{
  width: 800,
  height: 600,
  background: "#222222",
  browser: Browser.view as Rectangle
};
