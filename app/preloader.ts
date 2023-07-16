import { contextBridge, ipcRenderer } from "electron";

window.addEventListener("DOMContentLoaded", () => {
  console.info(`App      : v${process.env.npm_package_version}`);
  console.info(`Node     : v${process.versions.node}`);
  console.info(`Chrome   : v${process.versions.chrome}`);
  console.info(`Electron : v${process.versions.electron}`);
});

contextBridge.exposeInMainWorld("resizeBrowserView", (view?: number) =>
  ipcRenderer.sendSync("Resize::BrowserView", view)
);

contextBridge.exposeInMainWorld("closeBrowserView", (view?: number) =>
  ipcRenderer.sendSync("Close::BrowserView", view)
);

contextBridge.exposeInMainWorld("openBrowserView", (url: string) =>
  ipcRenderer.sendSync("Open::BrowserView", url)
);

contextBridge.exposeInMainWorld("electron", true);

contextBridge.exposeInMainWorld("shutdown", () =>
  ipcRenderer.sendSync("shutdown")
);
