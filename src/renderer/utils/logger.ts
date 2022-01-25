export type LogLevel = "debug" | "info" | "warn" | "error";

export class Logger {
  static debug(context: string, ...message: any[]) {
    this.log("debug", context, ...message);
  }

  static info(context: string, ...message: any[]) {
    this.log("info", context, ...message);
  }

  static warn(context: string, ...message: any[]) {
    this.log("warn", context, ...message);
  }

  static error(context: string, ...message: any[]) {
    this.log("error", context, ...message);
  }

  private static log(level: LogLevel, context: string, ...message: any[]) {
    let color = "black";

    switch (level) {
      case "debug":
        color = "magenta";
        break;
      case "info":
        color = "royalblue";
        break;
      case "warn":
        color = "goldenrod";
        break;
      case "error":
        color = "red";
        break;
    }

    console.group(
      `%c[${level}] %c${context}`,
      `color:${color}; font-weight:bold;`,
      `color:slategray; font-weight:bold;`
    );
    if (level === "warn") console.warn(...message);
    else if (level === "error") console.error(...message);
    else console.log(...message);
    console.groupEnd();
  }
}
