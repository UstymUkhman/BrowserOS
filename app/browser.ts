import type { BrowserWindow, WebContents, IpcMainEvent, Rectangle } from "electron";
import { BrowserView, ipcMain } from "electron";
import Config from "./config";

type ViewContents = WebContents & {
  destroy: () => void;
};

export default class Browser
{
  private readonly views: BrowserView[] = [];
  private readonly resizeView = this.resize.bind(this);
  private readonly closeView = this.dispose.bind(this);
  private readonly openView = this.createView.bind(this);

  public constructor (private readonly main: BrowserWindow) {
    this.crateEvents();
  }

  private crateEvents (): void {
    ipcMain.on("Open::BrowserView", this.openView);
    ipcMain.on("Resize::BrowserView", this.resizeView);
    ipcMain.on("Close::BrowserView", this.closeView);
  }

  private createView (_: IpcMainEvent, url: string, bounds = Config.browser): void {
    const view = new BrowserView();

    view.setAutoResize({
      horizontal: true,
      vertical: true,
      height: true,
      width: true
    });

    this.main.addBrowserView(view);
    view.webContents.loadURL(url);

    view.setBounds(bounds);
    this.views.push(view);
  }

  private resize (_: IpcMainEvent, bounds: Rectangle, view = 0): void {
    this.views[view].setBounds(bounds);
  }

  private removeEvents (): void {
    ipcMain.off("Open::BrowserView", this.openView);
    ipcMain.off("Resize::BrowserView", this.resizeView);
    ipcMain.off("Close::BrowserView", this.closeView);
  }

  private dispose (_?: IpcMainEvent, view = 0): void {
    // https://github.com/electron/electron/pull/23578#issuecomment-742706524
    (this.views[view].webContents as ViewContents).destroy();
    this.main.removeBrowserView(this.views[view]);
    this.views.splice(view, 1);
  }

  public destroy (): void {
    for (let view = this.views.length; view--; )
      this.dispose(undefined, view);

    this.removeEvents();
    this.main.setBrowserView(null);
  }
}
