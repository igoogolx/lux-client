import { app, BrowserWindow, ipcMain, Menu, Tray, nativeImage } from "electron";
import path from "path";
import exitHook from "exit-hook";
import getPort from "get-port";
import {
  DEFAULT_PORT,
  elevate,
  getBasePath,
  getCorePort,
  getTray,
  setCorePort,
} from "./utils";
import { Core } from "./core";

const isWindows = process.platform === "win32";

if (isWindows) {
  app.setAppUserModelId(app.name);
}

app.commandLine.appendSwitch("disable-http-cache");

const gotTheLock = app.requestSingleInstanceLock();
let core: Core = null;
let mainWindow: BrowserWindow | null = null;

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (!gotTheLock) {
  app.quit();
} else {
  const isDev = process.env.NODE_ENV === "development";

  const createWindow = async () => {
    if (!getCorePort()) {
      const corePort = await getPort({ port: DEFAULT_PORT });
      setCorePort(corePort);
    }

    // Create the browser window.
    mainWindow = new BrowserWindow({
      width: 768,
      resizable: false,
      height: 600,
      maximizable: false,
      useContentSize: true,
      frame: false,
      hasShadow: true,
      show: false,
      webPreferences: {
        preload: path.resolve(__dirname, "preload.js"),
        nodeIntegration: true,
      },
    });

    mainWindow.once("ready-to-show", () => {
      mainWindow.show();
    });

    const url = isDev
      ? "http://localhost:3000"
      : `file://${path.join(
          getBasePath(),
          "core",
          "web",
          "dist",
          "index.html"
        )}?hub_address=127.0.0.1${getCorePort()}`;
    await mainWindow.loadURL(url);

    const items = Menu.getApplicationMenu().items.filter(
      (item) => !["View", "Help", "File", "Edit"].includes(item.label)
    );
    const menu = Menu.buildFromTemplate(items);
    Menu.setApplicationMenu(menu);
    if (core === null) {
      core = new Core();
    }
    if (!isDev) {
      await core.start();
    }

    if (isDev) {
      mainWindow.webContents.openDevTools();
    }
  };

  // This method will be called when Electron has finished
  // initialization and is ready to create browser windows.
  // Some APIs can only be used after this event occurs.
  app.on("ready", createWindow);

  // Quit when all windows are closed, except on macOS. There, it's common
  // for applications and their menu bar to stay active until the user quits
  // explicitly with Cmd + Q.
  app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
      BrowserWindow.getAllWindows().forEach((browserWindow) => {
        browserWindow.destroy();
      });
    }
  });

  app.on("activate", () => {
    // On OS X it's common to re-create a window in the app when the
    // dock assets is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });

  app.on("second-instance", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
      return;
    }
    // Someone tried to run a second instance, we should focus our window.
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.focus();
    }
  });

  let tray;
  app.whenReady().then(() => {
    tray = new Tray(nativeImage.createFromPath(getTray()));
    const appNameLabel = isDev ? "Lux-dev" : "Lux";
    const contextMenu = Menu.buildFromTemplate([
      {
        label: appNameLabel,
        enabled: false,
      },
      {
        type: "separator",
      },
      {
        label: "quit",
        click: () => {
          app.quit();
        },
      },
    ]);
    tray.setToolTip(appNameLabel);
    tray.on("double-click", () => {
      if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
      } else if (mainWindow) {
        mainWindow.show();
      }
    });
    tray.setContextMenu(contextMenu);
  });
}

ipcMain.handle("exit", () => {
  app.exit();
});

ipcMain.handle("restart", () => {
  app.relaunch();
  app.exit();
});

ipcMain.handle("close", () => {
  mainWindow?.close();
});

ipcMain.handle("minimize", () => {
  mainWindow?.minimize();
});

ipcMain.handle("elevate", elevate);

ipcMain.handle("getCorePort", getCorePort);

exitHook(() => {
  if (core) {
    core.stop();
  }
});
