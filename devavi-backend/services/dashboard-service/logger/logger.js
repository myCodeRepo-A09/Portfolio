const fs = require("fs");
const { createLogger, format, transports } = require("winston");

// Ensure 'logs' directory exists
if (!fs.existsSync("logs")) {
  fs.mkdirSync("logs");
}

const logger = createLogger({
  level: "info",
  format: format.combine(
    format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    format.printf(
      (info) =>
        `${info.timestamp} [${info.level.toUpperCase()}] ${info.message}`
    )
  ),
  transports: [
    new transports.File({ filename: "logger/error.log", level: "error" }),
    new transports.File({ filename: "logger/combined.log" }),
  ],
});

// Console logging in non-production
if (process.env.NODE_ENV !== "production") {
  logger.add(
    new transports.Console({
      format: format.combine(format.colorize(), format.simple()),
    })
  );
}

module.exports = logger;
