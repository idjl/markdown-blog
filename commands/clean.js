"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CleanCommand = void 0;
const utils_1 = require("../utils");
const path_1 = __importDefault(require("path"));
class CleanCommand {
    /**
     * 执行清理命令
     */
    async execute() {
        utils_1.logger.info('Starting clean process...');
        try {
            const distDir = path_1.default.resolve(process.cwd(), 'dist');
            if (await utils_1.FileUtils.exists(distDir)) {
                await utils_1.FileUtils.removeDir(distDir);
                utils_1.logger.success('Cleaned build directory');
            }
            else {
                utils_1.logger.info('Build directory does not exist');
            }
        }
        catch (error) {
            utils_1.logger.error('Clean failed', error);
            throw error;
        }
    }
}
exports.CleanCommand = CleanCommand;
//# sourceMappingURL=clean.js.map