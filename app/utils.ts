import path from "path";
import sudo from "@vscode/sudo-prompt";
import os from "os";
import { execSync } from "child_process";
import * as fs from "fs";
import { app } from "electron";

const CORE_NAME = "lux-core";

export const DEFAULT_PORT = 9001;

let corePort = "";

export const setCorePort = (port: number) => {
  corePort = port.toString();
};

export const getCorePort = () => {
  return corePort;
};

export const getBasePath = () => {
  const appPath = app.getAppPath();
  return process.env.NODE_ENV === "development"
    ? path.dirname(appPath)
    : appPath.replace("app.asar", "app.asar.unpacked");
};

export const getCorePath = () => {
  const runningDir = path.resolve(getBasePath(), "core");
  let binaryPath = path.resolve(runningDir, CORE_NAME);
  if (os.platform() === "win32") {
    binaryPath += ".exe";
  }
  return binaryPath;
};

export const elevate = async () => {
  if (os.platform() !== "darwin" && os.platform() !== "linux") {
    throw new Error("the platform is not supported");
  }
  return new Promise((resolve, reject) => {
    const runningDir = getBasePath();
    const elevatePath = path.resolve(runningDir, "scripts/elevate");
    execSync(`chmod +x "${elevatePath}"`);
    const exePath = getCorePath();
    sudo.exec(`"${elevatePath}" "${exePath}"`, { name: "elevate" }, (err) => {
      if (err) {
        reject(err);
        return;
      }
      resolve("");
    });
  });
};

export const getTray = () => {
  const fileName = os.platform() === "win32" ? "logo.ico" : "trayTemplate.png";
  return path.resolve(getBasePath(), "assets", fileName);
};

export const sleep = (timeout: number) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve("");
    }, timeout);
  });
};

export const makeFileExecuted = async (filePath: string) => {
  let isExecuted: boolean;
  try {
    await fs.promises.access(filePath, fs.constants.X_OK);
    isExecuted = true;
  } catch (e) {
    isExecuted = false;
  }
  if (isExecuted) return;
  await fs.promises.chmod(filePath, 0o770);
};
