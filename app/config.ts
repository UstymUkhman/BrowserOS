import { Config } from "../src/components/Browser/config";

const height = 600.0, width = 800.0;

export default {
  width, height, background: "#222222",
  browser: Config.view(width, height)
};
