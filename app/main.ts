import { BrowserWindow, app, screen, ipcMain } from "electron";
const PRODUCTION = process.env.ENVIRONMENT !== "development";

process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = "true";
delete process.env.ELECTRON_ENABLE_SECURITY_WARNINGS;

let window: BrowserWindow | null = null;
let browser: Browser | null = null;

import Browser from "./browser";
import Config from "./config";
import { join } from "path";

function createWindow(): void {
  if (window !== null) return;

  window = new BrowserWindow({
    webPreferences: {
      preload: join(__dirname, "./preloader.js")
    },

    backgroundColor: Config.background,
    fullscreen: PRODUCTION,
    frame: !PRODUCTION
  });

  window.loadFile(join(__dirname, "../dist/index.html"));
  !PRODUCTION && window.webContents.openDevTools();

  window.on("closed", () => window = null);
  browser = new Browser(window);
}

app.whenReady().then(() => {
  if (PRODUCTION) return;

  const { width: screenWidth, height: screenHeight } =
    screen.getPrimaryDisplay().workAreaSize;

  const { width, height } = Config;
  const x = (screenWidth - width) * 0.5;
  const y = (screenHeight - height) * 0.5;

  window?.setBounds({ x, y, width, height });
});

app.on("ready", createWindow);

app.on("window-all-closed", () =>
  process.platform !== "darwin" && app.quit()
);

app.on("web-contents-created", (_, contents) =>
  contents.setWindowOpenHandler(() => ({ action: "deny" }))
);

ipcMain.on("shutdown", () => {
  browser?.destroy();
  window?.destroy();
});
