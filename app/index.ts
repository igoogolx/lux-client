import {
  app,
  BrowserWindow,
  ipcMain,
  Menu,
  Tray,
  nativeImage,
  nativeTheme,
} from "electron";
import path from "path";
import exitHook from "exit-hook";
import getPort from "get-port";
import os from "os";
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
      resizable: true,
      height: 600,
      minHeight: 600,
      minWidth: 600,
      maximizable: true,
      useContentSize: true,
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

    if (core === null) {
      core = new Core();
    }
    if (!isDev) {
      core.start();
    }

    const url = isDev
      ? "http://localhost:3000"
      : `file://${path.join(
          getBasePath(),
          "core",
          "web",
          "dist",
          "index.html"
        )}?hub_address=127.0.0.1:${getCorePort()}`;
    await mainWindow.loadURL(url);

    let menu = null;
    if (os.platform() === "darwin") {
      const items = Menu.getApplicationMenu().items.filter(
        (item) => !["View", "Help", "Edit"].includes(item.label)
      );
      menu = Menu.buildFromTemplate(items);
    }
    Menu.setApplicationMenu(menu);

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
  const makeTray = () => {
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
  };

  app.whenReady().then(() => {
    if (os.platform() === "win32") {
      makeTray();
    }
  });
}

ipcMain.handle("exit", () => {
  app.exit();
});

ipcMain.handle("restart", () => {
  app.relaunch();
  app.exit();
});

ipcMain.handle("elevate", elevate);

ipcMain.handle("openDevTools", () => {
  mainWindow.webContents.openDevTools();
});

ipcMain.handle("setNativeTheme", (event, theme) => {
  nativeTheme.themeSource = theme;
});

exitHook(() => {
  if (core) {
    core.stop();
  }
});
