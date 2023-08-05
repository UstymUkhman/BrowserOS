import type { IpcMainEvent, Rectangle /*, Event */ } from "electron";
import { BrowserWindow, app, screen, ipcMain } from "electron";
const PRODUCTION = process.env.ENVIRONMENT !== "development";

process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = "true";
delete process.env.ELECTRON_ENABLE_SECURITY_WARNINGS;

let window: BrowserWindow | null = null;
import { join } from "path";

type CustomBrowser = BrowserWindow & {
  frameName: string;
};

// type BrowserEvent = Event & {
//   sender: CustomBrowser;
// };

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

    // event.newGuest.on("focus", (event: BrowserEvent) => {
    //   console.log("Focus: ", event);
    // });

    event.newGuest.moveTop();
    event.newGuest.focus();
  })
);

app.on("window-all-closed", () =>
  process.platform !== "darwin" && app.quit()
);

ipcMain.on("OS::Shutdown", () => window?.destroy());

ipcMain.on("Browser::Update", (_: IpcMainEvent, id: string, rect: Rectangle) => {
  const browser = findBrowserWindow(id);
  browser?.setBounds(rect);
  focusBrowserWindow(browser);
});

ipcMain.on("Browser::Hide", (_: IpcMainEvent, id: string) => {
  const browser = findBrowserWindow(id);
  if (!(browser?.isVisible())) return;

  browser.blur();
  browser.hide();
});

ipcMain.on("Browser::Show", (_: IpcMainEvent, id: string) => {
  const browser = findBrowserWindow(id);
  if (browser?.isFocused()) return;
  focusBrowserWindow(browser);
});

function findBrowserWindow (id: string): BrowserWindow | void
{
  const windows = BrowserWindow.getAllWindows() as CustomBrowser[];
  const browser = windows.find(({ frameName }) => frameName === id);
  return browser ?? console.error(`Browser Window "${id}" not found.`);
}

function focusBrowserWindow (browser: BrowserWindow | void): void
{
  if (!browser) return;
  browser.moveTop();
  browser.focus();
  browser.show();
}
