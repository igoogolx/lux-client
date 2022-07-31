import { ChildProcessWithoutNullStreams, spawn } from "child_process";
import path from "path";
import { logger } from "./logger";

export class ProcessManager {
  private handleStdout: (data: string) => void;

  private handleError: (error: Error) => void;

  private handleClose: (code: number) => void;

  private handleExit: (code: number) => void;

  private runningProcess: ChildProcessWithoutNullStreams | null;

  private readonly filePath: string | null = null;

  private readonly args: string[] = [];

  constructor(filePath: string, args: string[]) {
    this.filePath = filePath;
    this.args = args;
  }

  public stop() {
    if (this.runningProcess) {
      this.runningProcess.kill("SIGTERM");
    }
  }

  public async run() {
    return new Promise((resolve, reject) => {
      this.runningProcess = spawn(this.filePath, this.args, {
        cwd: path.resolve(this.filePath, ".."),
        shell: false,
      });
      this.runningProcess.stdout.on("data", (data) => {
        resolve("");
        this.handleStdout?.(data.toString());
      });
      this.runningProcess.on("close", (code) => {
        logger.info(`core closed, code: ${code}`);
        reject(new Error("process closed"));
        this.handleClose?.(code);
      });

      this.runningProcess.on("exit", (code) => {
        logger.info(`core exited, code: ${code}`);
        reject(new Error("process exited"));
        this?.handleExit?.(code);
      });
      this.runningProcess.on("error", (code) => {
        logger.error(`core errored, code: ${code}`);
        reject(new Error("process errored"));
        this?.handleError?.(code);
      });
    });
  }

  set stdout(callback: (data: string) => void) {
    this.handleStdout = callback;
  }

  set onError(callback: (error: Error) => void) {
    this.handleError = callback;
  }

  set onExit(callback: (code: number) => void) {
    this.handleExit = callback;
  }

  set onClose(callback: (code: number) => void) {
    this.handleClose = callback;
  }
}
