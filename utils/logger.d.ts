export declare class Logger {
    private static instance;
    private silent;
    private constructor();
    static getInstance(): Logger;
    setSilent(silent: boolean): void;
    info(message: string, ...args: any[]): void;
    success(message: string, ...args: any[]): void;
    warn(message: string, ...args: any[]): void;
    error(message: string, error?: Error | any, ...args: any[]): void;
    debug(message: string, ...args: any[]): void;
    time(label: string): void;
    timeEnd(label: string): void;
}
export declare const logger: Logger;
//# sourceMappingURL=logger.d.ts.map