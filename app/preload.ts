import { contextBridge, ipcRenderer, shell } from "electron";
import os from "os";

contextBridge.exposeInMainWorld("elevate", async () => {
  await ipcRenderer.invoke("elevate");
  await ipcRenderer.invoke("restart");
});

contextBridge.exposeInMainWorld("restart", async () => {
  await ipcRenderer.invoke("restart");
});

contextBridge.exposeInMainWorld("exit", async () => {
  await ipcRenderer.invoke("exit");
});

contextBridge.exposeInMainWorld("shellOpenPath", async (path: string) => {
  await shell.openPath(path);
});

contextBridge.exposeInMainWorld("shellOpenExternal", async (url: string) => {
  await shell.openExternal(url);
});

contextBridge.exposeInMainWorld("getPlatform", () => {
  return os.platform();
});

contextBridge.exposeInMainWorld("IS_ELECTRON_ENV", true);

contextBridge.exposeInMainWorld("openDevTools", async () => {
  return ipcRenderer.invoke("openDevTools");
});
