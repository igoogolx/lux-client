import winston, { format } from "winston";
import path from "path";
import { getBasePath } from "./utils";

const { json, combine, timestamp } = format;

const logDir = path.join(getBasePath(), "logs");

export const logger = winston.createLogger({
  level: "info",
  format: combine(timestamp({ format: "YYYY-MM-DD hh:mm:ss A ZZ" }), json()),
  defaultMeta: { service: "user-service" },
  transports: [
    //
    // - Write all logs with importance level of `error` or less to `error.log`
    // - Write all logs with importance level of `info` or less to `combined.log`
    //
    new winston.transports.File({
      filename: path.resolve(logDir, "error.log"),
      level: "error",
      maxsize: 5 * 1024 * 1024,
      maxFiles: 3,
    }),
    new winston.transports.File({
      filename: path.resolve(logDir, "combined.log"),
      maxsize: 5 * 1024 * 1024,
      maxFiles: 3,
    }),
  ],
  exceptionHandlers: [
    new winston.transports.File({
      filename: path.resolve(logDir, "combined.log"),
      maxsize: 5 * 1024 * 1024,
      maxFiles: 3,
    }),
  ],
});

//
// If we're not in production then log to the `console` with the format:
// `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
//
if (process.env.NODE_ENV !== "production") {
  logger.add(
    new winston.transports.Console({
      format: winston.format.simple(),
    })
  );
}
