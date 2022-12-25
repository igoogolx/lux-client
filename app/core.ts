import { Notification, powerMonitor, app } from "electron";
import {
  getStatus,
  init,
  start as startCoreConnect,
  stop as stopCoreConnect,
} from "lux-js-sdk";
import os from "os";
import { getCorePath, getCorePort, makeFileExecuted, sleep } from "./utils";
import { ProcessManager } from "./processManager";
import { NotificationIcon } from "./constants";

export class Core {
  private manager: ProcessManager | null = null;

  private lastStatus = false;

  private stoppedManually = false;

  stop() {
    if (this.manager) {
      this.stoppedManually = true;
      this.manager.stop();
    }
  }

  start = async () => {
    if (this.manager) {
      return;
    }
    this.stoppedManually = false;
    const args = [
      "-port",
      getCorePort().toString(),
      "-check_elevated",
      "false",
    ];
    this.manager = new ProcessManager(getCorePath(), args);
    if (["darwin", "linux"].includes(os.platform())) {
      await makeFileExecuted(getCorePath());
    }
    await this.manager.run();
    this.manager.onError = (error) => {
      this.manager = null;
      new Notification({
        title: "lux",
        body: `lux_core has a error: ${error.message}`,
        icon: NotificationIcon,
      }).show();
      app.exit();
    };
    this.manager.onExit = () => {
      if (!this.stoppedManually) {
        new Notification({
          title: "lux",
          body: `lux_core has exited unexpectedly`,
          icon: NotificationIcon,
        }).show();
        app.exit();
      }
    };
    init(`localhost:${getCorePort()}`);
    powerMonitor.on("suspend", async () => {
      const res = await getStatus();
      this.lastStatus = res.isStarted;
      if (this.lastStatus) {
        await stopCoreConnect();
      }
    });
    powerMonitor.on("user-did-resign-active", async () => {
      const res = await getStatus();
      this.lastStatus = res.isStarted;
      if (this.lastStatus) {
        await stopCoreConnect();
      }
    });
    powerMonitor.on("resume", async () => {
      if (this.lastStatus) {
        // Wait for os to connect network
        await sleep(5000);
        await startCoreConnect();
        new Notification({
          title: "lux",
          body: "lux has reconnected",
          icon: NotificationIcon,
        }).show();
      }
    });
  };
}
