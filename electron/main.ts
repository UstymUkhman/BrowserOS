import { BrowserWindow, app, screen, ipcMain } from "electron";
const PRODUCTION = process.env.ENVIRONMENT !== "development";
import type { IpcMainEvent, Rectangle } from "electron";

process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = "true";
delete process.env.ELECTRON_ENABLE_SECURITY_WARNINGS;

let window: BrowserWindow | null = null;
import { exec } from "child_process";
import { join } from "path";

type CustomBrowser = BrowserWindow & {
  frameName: string;
};

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
    resizable: false,
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
      Object.assign(options, {
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

    event.newGuest.on("focus", () =>
      window?.webContents.send("Browser::Focus", frameName)
    );

    event.newGuest.moveTop();
    event.newGuest.focus();
  })
);

app.on("window-all-closed", () =>
  process.platform !== "darwin" && app.quit()
);

ipcMain.on("Browser::Show", (_: IpcMainEvent, id: string) =>
  (BrowserWindow.getAllWindows() as CustomBrowser[]).forEach(window => {
    if (window.frameName === id) focusBrowserWindow(window);
    else if (window.frameName?.includes("Browser")) window.hide();
  })
);

ipcMain.on("Browser::Blur", (_: IpcMainEvent, id: string) =>
  findBrowserWindow(id)?.blur()
);

ipcMain.on("Browser::Hide", (_: IpcMainEvent, id?: string) =>
  (BrowserWindow.getAllWindows() as CustomBrowser[]).forEach(window =>
    window.frameName?.includes("Browser") && window.frameName !== id && window.hide()
  )
);

ipcMain.on("Browser::Reload", (_: IpcMainEvent, id: string) =>
  findBrowserWindow(id)?.webContents.reload()
);

ipcMain.on("Browser::Update", (_: IpcMainEvent, id: string, rect: Rectangle) => {
  const window = findBrowserWindow(id);
  window?.setBounds(rect);
  focusBrowserWindow(window);
});

function focusBrowserWindow (window?: BrowserWindow | void): void {
  if (!window) return;
  window.moveTop();
  window.focus();
  window.show();
}

function findBrowserWindow (id: string): BrowserWindow | void {
  const windows = BrowserWindow.getAllWindows() as CustomBrowser[];
  const window = windows.find(({ frameName }) => frameName === id);
  return window ?? console.error(`Browser Window "${id}" not found.`);
}

ipcMain.on("OS::Shutdown", () => {
  window?.destroy();
  exec("init 0");
});
