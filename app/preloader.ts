import { contextBridge, ipcRenderer } from "electron";

window.addEventListener("DOMContentLoaded", () => {
  console.info(`App      : v${process.env.npm_package_version}`);
  console.info(`Node     : v${process.versions.node}`);
  console.info(`Chrome   : v${process.versions.chrome}`);
  console.info(`Electron : v${process.versions.electron}`);
});

contextBridge.exposeInMainWorld("electron", true);

contextBridge.exposeInMainWorld("shutdown", () =>
  ipcRenderer.sendSync("shutdown")
);
