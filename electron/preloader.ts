import type { Rectangle } from "electron";
import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("Electron", {
  showBrowser: (id: string) =>
    ipcRenderer.send("Browser::Show", id),

  blurBrowser: (id?: string) =>
    ipcRenderer.send("Browser::Blur", id),

  hideBrowsers: (id?: string) =>
    ipcRenderer.send("Browser::Hide", id),

  reloadBrowser: (id: string) =>
    ipcRenderer.send("Browser::Reload", id),

  updateBrowser: (id: string, rect: Rectangle) =>
    ipcRenderer.send("Browser::Update", id, rect),

  shutdown: () => ipcRenderer.sendSync("OS::Shutdown")
});

window.addEventListener("DOMContentLoaded", () => {
  console.info(`Node      : v${process.versions.node}`);
  console.info(`Chrome    : v${process.versions.chrome}`);
  console.info(`Electron  : v${process.versions.electron}`);
  console.info(`BrowserOS : v${process.env.npm_package_version}`);
});

ipcRenderer.on("Browser::Focus", (_, detail: string) =>
  document.dispatchEvent(new CustomEvent("Browser::Active", { detail }))
);

ipcRenderer.on("Browser::Navigate", (_, id: string, url: string) =>
  document.dispatchEvent(new CustomEvent("Browser::Navigation", { detail: { id, url } }))
);

ipcRenderer.on("Browser::Redirect", (_, id: string, url: string) =>
  document.dispatchEvent(new CustomEvent("Browser::Redirection", { detail: { id, url } }))
);
