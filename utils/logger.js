"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = exports.Logger = void 0;
class Logger {
    constructor() {
        this.silent = false;
    }
    static getInstance() {
        if (!Logger.instance) {
            Logger.instance = new Logger();
        }
        return Logger.instance;
    }
    setSilent(silent) {
        this.silent = silent;
    }
    info(message, ...args) {
        if (this.silent)
            return;
        console.log(`[INFO] ${message}`, ...args);
    }
    success(message, ...args) {
        if (this.silent)
            return;
        console.log(`[SUCCESS] ${message}`, ...args);
    }
    warn(message, ...args) {
        if (this.silent)
            return;
        console.warn(`[WARN] ${message}`, ...args);
    }
    error(message, error, ...args) {
        if (this.silent)
            return;
        console.error(`[ERROR] ${message}`, error, ...args);
    }
    debug(message, ...args) {
        if (this.silent || process.env.NODE_ENV !== 'development')
            return;
        console.debug(`[DEBUG] ${message}`, ...args);
    }
    time(label) {
        if (this.silent)
            return;
        console.time(label);
    }
    timeEnd(label) {
        if (this.silent)
            return;
        console.timeEnd(label);
    }
}
exports.Logger = Logger;
exports.logger = Logger.getInstance();
//# sourceMappingURL=logger.js.map