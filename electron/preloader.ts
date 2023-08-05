import type { Rectangle } from "electron";
import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("Electron", {
  hideBrowsers: () =>
    ipcRenderer.send("Browser::Hide"),

  showBrowser: (id: string) =>
    ipcRenderer.send("Browser::Show", id),

  updateBrowser: (id: string, rect: Rectangle) =>
    ipcRenderer.send("Browser::Update", id, rect),

  shutdown: () => ipcRenderer.sendSync("OS::Shutdown")
});

window.addEventListener("DOMContentLoaded", () => {
  console.info(`OS       : v${process.env.npm_package_version}`);
  console.info(`Node     : v${process.versions.node}`);
  console.info(`Chrome   : v${process.versions.chrome}`);
  console.info(`Electron : v${process.versions.electron}`);
});

ipcRenderer.on("Browser::Focus", (_, detail: string) =>
  document.dispatchEvent(new CustomEvent("Browser::Active", { detail }))
);
