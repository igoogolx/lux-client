import { ChildProcessWithoutNullStreams, spawn } from "child_process";
import path from "path";
import { logger } from "./logger";

export class ProcessManager {
  private handleStdout: ((code: string) => void) | null = null;

  private handleError: ((error: Error) => void) | null = null;

  private handleExit: ((code: number) => void) | null = null;

  private runningProcess: ChildProcessWithoutNullStreams | null = null;

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
      if (!this.filePath) {
        return;
      }
      this.runningProcess = spawn(this.filePath, this.args, {
        cwd: path.resolve(this.filePath, ".."),
        shell: false,
      });
      this.runningProcess.stdout.on("data", (data) => {
        resolve("");
        this.handleStdout?.(data.toString());
      });

      this.runningProcess.on("close", (code) => {
        logger.info(`core exited, code: ${code}`);
        reject(new Error("process exited"));
        if (code !== null) {
          this.handleExit?.(code);
        }
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
}
