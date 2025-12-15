"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileUtils = void 0;
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = __importDefault(require("path"));
const glob_1 = require("glob");
const logger_1 = require("./logger");
class FileUtils {
    /**
     * 确保目录存在，如果不存在则创建
     */
    static async ensureDir(dirPath) {
        try {
            await fs_extra_1.default.ensureDir(dirPath);
            logger_1.logger.debug(`Ensured directory exists: ${dirPath}`);
        }
        catch (error) {
            logger_1.logger.error(`Failed to ensure directory: ${dirPath}`, error);
            throw error;
        }
    }
    /**
     * 清空目录
     */
    static async emptyDir(dirPath) {
        try {
            await fs_extra_1.default.emptyDir(dirPath);
            logger_1.logger.debug(`Emptied directory: ${dirPath}`);
        }
        catch (error) {
            logger_1.logger.error(`Failed to empty directory: ${dirPath}`, error);
            throw error;
        }
    }
    /**
     * 删除目录
     */
    static async removeDir(dirPath) {
        try {
            await fs_extra_1.default.remove(dirPath);
            logger_1.logger.debug(`Removed directory: ${dirPath}`);
        }
        catch (error) {
            logger_1.logger.error(`Failed to remove directory: ${dirPath}`, error);
            throw error;
        }
    }
    /**
     * 复制文件或目录
     */
    static async copy(src, dest, options) {
        try {
            await fs_extra_1.default.copy(src, dest, options);
            logger_1.logger.debug(`Copied from ${src} to ${dest}`);
        }
        catch (error) {
            logger_1.logger.error(`Failed to copy from ${src} to ${dest}`, error);
            throw error;
        }
    }
    /**
     * 写入文件
     */
    static async writeFile(filePath, content) {
        try {
            await fs_extra_1.default.ensureDir(path_1.default.dirname(filePath));
            await fs_extra_1.default.writeFile(filePath, content, 'utf-8');
            logger_1.logger.debug(`Wrote file: ${filePath}`);
        }
        catch (error) {
            logger_1.logger.error(`Failed to write file: ${filePath}`, error);
            throw error;
        }
    }
    /**
     * 读取文件
     */
    static async readFile(filePath) {
        try {
            const content = await fs_extra_1.default.readFile(filePath, 'utf-8');
            logger_1.logger.debug(`Read file: ${filePath}`);
            return content;
        }
        catch (error) {
            logger_1.logger.error(`Failed to read file: ${filePath}`, error);
            throw error;
        }
    }
    /**
     * 检查文件是否存在
     */
    static async exists(filePath) {
        try {
            await fs_extra_1.default.access(filePath);
            return true;
        }
        catch {
            return false;
        }
    }
    /**
     * 获取文件状态
     */
    static async stat(filePath) {
        try {
            return await fs_extra_1.default.stat(filePath);
        }
        catch (error) {
            logger_1.logger.error(`Failed to stat file: ${filePath}`, error);
            throw error;
        }
    }
    /**
     * 获取文件扩展名
     */
    static getExt(filePath) {
        return path_1.default.extname(filePath).toLowerCase();
    }
    /**
     * 获取文件名（不含扩展名）
     */
    static getBaseName(filePath) {
        return path_1.default.basename(filePath, path_1.default.extname(filePath));
    }
    /**
     * 获取文件所在目录
     */
    static getDir(filePath) {
        return path_1.default.dirname(filePath);
    }
    /**
     * 获取相对路径
     */
    static getRelative(from, to) {
        return path_1.default.relative(from, to);
    }
    /**
     * 获取绝对路径
     */
    static getAbsolute(filePath) {
        return path_1.default.resolve(filePath);
    }
    /**
     * 连接路径
     */
    static join(...paths) {
        return path_1.default.join(...paths);
    }
    /**
     * 查找文件（使用glob模式）
     */
    static async glob(pattern, options) {
        try {
            const files = await (0, glob_1.glob)(pattern, options || {});
            logger_1.logger.debug(`Glob found ${files.length} files for pattern: ${pattern}`);
            return files;
        }
        catch (error) {
            logger_1.logger.error(`Glob failed for pattern: ${pattern}`, error);
            throw error;
        }
    }
    /**
     * 获取目录中的所有文件
     */
    static async getFiles(dir, recursive = true) {
        try {
            const pattern = recursive
                ? path_1.default.join(dir, '**', '*')
                : path_1.default.join(dir, '*');
            const files = await this.glob(pattern, { nodir: true });
            return files;
        }
        catch (error) {
            logger_1.logger.error(`Failed to get files from directory: ${dir}`, error);
            throw error;
        }
    }
    /**
     * 获取目录中的所有Markdown文件
     */
    static async getMarkdownFiles(dir) {
        try {
            const pattern = path_1.default.join(dir, '**', '*.md');
            const files = await this.glob(pattern);
            return files;
        }
        catch (error) {
            logger_1.logger.error(`Failed to get Markdown files from directory: ${dir}`, error);
            throw error;
        }
    }
    /**
     * 创建目录结构
     */
    static async createDirStructure(basePath, structure) {
        for (const dir of structure) {
            const fullPath = path_1.default.join(basePath, dir);
            await this.ensureDir(fullPath);
        }
    }
    /**
     * 计算文件大小
     */
    static async getFileSize(filePath) {
        try {
            const stats = await this.stat(filePath);
            return stats.size;
        }
        catch (error) {
            logger_1.logger.error(`Failed to get file size: ${filePath}`, error);
            return 0;
        }
    }
    /**
     * 格式化文件大小
     */
    static formatFileSize(bytes) {
        const sizes = ['B', 'KB', 'MB', 'GB'];
        if (bytes === 0)
            return '0 B';
        const i = Math.floor(Math.log(bytes) / Math.log(1024));
        return Math.round((bytes / Math.pow(1024, i)) * 100) / 100 + ' ' + sizes[i];
    }
}
exports.FileUtils = FileUtils;
//# sourceMappingURL=file.js.map