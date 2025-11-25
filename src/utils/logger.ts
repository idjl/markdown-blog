export class Logger {
  private static instance: Logger;
  private silent: boolean = false;

  private constructor() {}

  static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  setSilent(silent: boolean): void {
    this.silent = silent;
  }

  info(message: string, ...args: any[]): void {
    if (this.silent) return;
    console.log(`[INFO] ${message}`, ...args);
  }

  success(message: string, ...args: any[]): void {
    if (this.silent) return;
    console.log(`[SUCCESS] ${message}`, ...args);
  }

  warn(message: string, ...args: any[]): void {
    if (this.silent) return;
    console.warn(`[WARN] ${message}`, ...args);
  }

  error(message: string, error?: Error | any, ...args: any[]): void {
    if (this.silent) return;
    console.error(`[ERROR] ${message}`, error, ...args);
  }

  debug(message: string, ...args: any[]): void {
    if (this.silent || process.env.NODE_ENV !== 'development') return;
    console.debug(`[DEBUG] ${message}`, ...args);
  }

  time(label: string): void {
    if (this.silent) return;
    console.time(label);
  }

  timeEnd(label: string): void {
    if (this.silent) return;
    console.timeEnd(label);
  }
}

export const logger = Logger.getInstance();
