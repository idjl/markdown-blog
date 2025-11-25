import fs from 'fs-extra';
import path from 'path';
import { glob } from 'glob';
import { logger } from './logger';

export class FileUtils {
  /**
   * 确保目录存在，如果不存在则创建
   */
  static async ensureDir(dirPath: string): Promise<void> {
    try {
      await fs.ensureDir(dirPath);
      logger.debug(`Ensured directory exists: ${dirPath}`);
    } catch (error) {
      logger.error(`Failed to ensure directory: ${dirPath}`, error);
      throw error;
    }
  }

  /**
   * 清空目录
   */
  static async emptyDir(dirPath: string): Promise<void> {
    try {
      await fs.emptyDir(dirPath);
      logger.debug(`Emptied directory: ${dirPath}`);
    } catch (error) {
      logger.error(`Failed to empty directory: ${dirPath}`, error);
      throw error;
    }
  }

  /**
   * 删除目录
   */
  static async removeDir(dirPath: string): Promise<void> {
    try {
      await fs.remove(dirPath);
      logger.debug(`Removed directory: ${dirPath}`);
    } catch (error) {
      logger.error(`Failed to remove directory: ${dirPath}`, error);
      throw error;
    }
  }

  /**
   * 复制文件或目录
   */
  static async copy(src: string, dest: string, options?: any): Promise<void> {
    try {
      await fs.copy(src, dest, options);
      logger.debug(`Copied from ${src} to ${dest}`);
    } catch (error) {
      logger.error(`Failed to copy from ${src} to ${dest}`, error);
      throw error;
    }
  }

  /**
   * 写入文件
   */
  static async writeFile(filePath: string, content: string): Promise<void> {
    try {
      await fs.ensureDir(path.dirname(filePath));
      await fs.writeFile(filePath, content, 'utf-8');
      logger.debug(`Wrote file: ${filePath}`);
    } catch (error) {
      logger.error(`Failed to write file: ${filePath}`, error);
      throw error;
    }
  }

  /**
   * 读取文件
   */
  static async readFile(filePath: string): Promise<string> {
    try {
      const content = await fs.readFile(filePath, 'utf-8');
      logger.debug(`Read file: ${filePath}`);
      return content;
    } catch (error) {
      logger.error(`Failed to read file: ${filePath}`, error);
      throw error;
    }
  }

  /**
   * 检查文件是否存在
   */
  static async exists(filePath: string): Promise<boolean> {
    try {
      await fs.access(filePath);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * 获取文件状态
   */
  static async stat(filePath: string): Promise<fs.Stats> {
    try {
      return await fs.stat(filePath);
    } catch (error) {
      logger.error(`Failed to stat file: ${filePath}`, error);
      throw error;
    }
  }

  /**
   * 获取文件扩展名
   */
  static getExt(filePath: string): string {
    return path.extname(filePath).toLowerCase();
  }

  /**
   * 获取文件名（不含扩展名）
   */
  static getBaseName(filePath: string): string {
    return path.basename(filePath, path.extname(filePath));
  }

  /**
   * 获取文件所在目录
   */
  static getDir(filePath: string): string {
    return path.dirname(filePath);
  }

  /**
   * 获取相对路径
   */
  static getRelative(from: string, to: string): string {
    return path.relative(from, to);
  }

  /**
   * 获取绝对路径
   */
  static getAbsolute(filePath: string): string {
    return path.resolve(filePath);
  }

  /**
   * 连接路径
   */
  static join(...paths: string[]): string {
    return path.join(...paths);
  }

  /**
   * 查找文件（使用glob模式）
   */
  static async glob(pattern: string, options?: any): Promise<string[]> {
    try {
      const files = await glob(pattern, options || {});
      logger.debug(`Glob found ${files.length} files for pattern: ${pattern}`);
      return files;
    } catch (error) {
      logger.error(`Glob failed for pattern: ${pattern}`, error);
      throw error;
    }
  }

  /**
   * 获取目录中的所有文件
   */
  static async getFiles(
    dir: string,
    recursive: boolean = true
  ): Promise<string[]> {
    try {
      const pattern = recursive
        ? path.join(dir, '**', '*')
        : path.join(dir, '*');
      const files = await this.glob(pattern, { nodir: true });
      return files;
    } catch (error) {
      logger.error(`Failed to get files from directory: ${dir}`, error);
      throw error;
    }
  }

  /**
   * 获取目录中的所有Markdown文件
   */
  static async getMarkdownFiles(dir: string): Promise<string[]> {
    try {
      const pattern = path.join(dir, '**', '*.md');
      const files = await this.glob(pattern);
      return files;
    } catch (error) {
      logger.error(
        `Failed to get Markdown files from directory: ${dir}`,
        error
      );
      throw error;
    }
  }

  /**
   * 创建目录结构
   */
  static async createDirStructure(
    basePath: string,
    structure: string[]
  ): Promise<void> {
    for (const dir of structure) {
      const fullPath = path.join(basePath, dir);
      await this.ensureDir(fullPath);
    }
  }

  /**
   * 计算文件大小
   */
  static async getFileSize(filePath: string): Promise<number> {
    try {
      const stats = await this.stat(filePath);
      return stats.size;
    } catch (error) {
      logger.error(`Failed to get file size: ${filePath}`, error);
      return 0;
    }
  }

  /**
   * 格式化文件大小
   */
  static formatFileSize(bytes: number): string {
    const sizes = ['B', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 B';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round((bytes / Math.pow(1024, i)) * 100) / 100 + ' ' + sizes[i];
  }
}
