import { BrowserWindow, app, screen, ipcMain } from "electron";
const PRODUCTION = process.env.ENVIRONMENT !== "development";
import type { IpcMainEvent, Rectangle } from "electron";

process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = "true";
delete process.env.ELECTRON_ENABLE_SECURITY_WARNINGS;

type BrowserWindows = (BrowserWindow & {
  frameName: string;
})[];

let window: BrowserWindow | null = null;
import { join } from "path";

app.on("ready", () => {
  if (window !== null) return;

  window = new BrowserWindow({
    webPreferences: {
      preload: join(__dirname, "./preloader.js"),
      nativeWindowOpen: true,
      contextIsolation: true
    },

    backgroundColor: "#222222",
    fullscreen: PRODUCTION,
    frame: false
  });

  window.loadFile(join(__dirname, "../dist/index.html"));
  !PRODUCTION && window.webContents.openDevTools();
  window.on("closed", () => window = null);
});

app.whenReady().then(() => {
  if (PRODUCTION) return;

  const height = 600.0;
  const width = 800.0;

  const { width: screenWidth, height: screenHeight } =
    screen.getPrimaryDisplay().workAreaSize;

  const y = (screenHeight - height) * 0.5 | 0.0;
  const x = (screenWidth - width) * 0.5 | 0.0;

  window?.setBounds({ x, y, width, height });
});

/**
 * Overrides native "window.open" method to open
 * a custom browser and prevents the creation
 * of any new window other than the browser:
 */
app.on("web-contents-created", (_, contents) =>
  contents.on("new-window", (event, _url, frameName, _disposition, options) => {
    if (!frameName.includes("Browser")) return;

    event.preventDefault();

    event.newGuest = new BrowserWindow(
      Object.assign(options,
      {
        parent: window as BrowserWindow,
        copyhistory: false,
        directories: false,
        scrollbars: false,
        resizable: false,
        title: frameName,
        location: false,
        menubar: false,
        toolbar: false,
        status: false,
        frame: false,
        modal: false
      })
    );
  })
);

app.on("window-all-closed", () =>
  process.platform !== "darwin" && app.quit()
);

ipcMain.on("OS::Shutdown", () => window?.destroy());

ipcMain.on("Browser::Update", (_: IpcMainEvent, id: string, rect: Rectangle) =>
  (BrowserWindow.getAllWindows() as BrowserWindows)
    .find(({ frameName }) => frameName === id)
    ?.setBounds(rect)
);
