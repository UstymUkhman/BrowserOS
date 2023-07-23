import { BrowserWindow, BrowserView, app, screen, ipcMain } from "electron";
import type { WebContents, IpcMainEvent, Rectangle } from "electron";
const PRODUCTION = process.env.ENVIRONMENT !== "development";

type ViewContents = WebContents & { destroy: () => void; };
process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = "true";
delete process.env.ELECTRON_ENABLE_SECURITY_WARNINGS;

let window: BrowserWindow | null = null;
let browser: Browser | null = null;
import { join } from "path";

class Browser
{
  private readonly views: BrowserView[] = [];
  private readonly resizeView = this.resize.bind(this);
  private readonly closeView = this.dispose.bind(this);
  private readonly openView = this.createView.bind(this);

  public constructor (private readonly main: BrowserWindow) {
    ipcMain.on("Open::BrowserView", this.openView);
    ipcMain.on("Resize::BrowserView", this.resizeView);
    ipcMain.on("Close::BrowserView", this.closeView);
  }

  private createView (_: IpcMainEvent, url: string, bounds: Rectangle): void {
    const view = new BrowserView();

    view.setAutoResize({
      horizontal: true,
      vertical: true,
      height: true,
      width: true
    });

    // this.main.addBrowserView(view);
    this.main.setBrowserView(view);
    view.webContents.loadURL(url);

    view.setBounds(bounds);
    this.views.push(view);
  }

  private resize (_: IpcMainEvent, view: number, bounds: Rectangle): void {
    this.views[view].setBounds(bounds);
  }

  // https://github.com/electron/electron/pull/23578#issuecomment-742706524
  private dispose (_?: IpcMainEvent, view = 0.0): void {
    this.main.removeBrowserView(this.views[view]);
    (this.views[view].webContents as ViewContents).destroy();
    this.views.splice(view, 1.0);
  }

  public destroy (): void {
    for (let view = this.views.length; view--; )
      this.dispose(undefined, view);

    ipcMain.off("Open::BrowserView", this.openView);
    ipcMain.off("Resize::BrowserView", this.resizeView);
    ipcMain.off("Close::BrowserView", this.closeView);

    this.main.setBrowserView(null);
  }
}

function createWindow(): void {
  if (window !== null) return;

  window = new BrowserWindow({
    webPreferences: {
      preload: join(__dirname, "./preloader.js")
    },

    backgroundColor: "#222222",
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

  const height = 699.0;
  const width = 816.0;

  const { width: screenWidth, height: screenHeight } =
    screen.getPrimaryDisplay().workAreaSize;

  const y = (screenHeight - height) * 0.5 | 0.0;
  const x = (screenWidth - width) * 0.5 | 0.0;

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
