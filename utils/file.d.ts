import fs from 'fs-extra';
export declare class FileUtils {
    /**
     * 确保目录存在，如果不存在则创建
     */
    static ensureDir(dirPath: string): Promise<void>;
    /**
     * 清空目录
     */
    static emptyDir(dirPath: string): Promise<void>;
    /**
     * 删除目录
     */
    static removeDir(dirPath: string): Promise<void>;
    /**
     * 复制文件或目录
     */
    static copy(src: string, dest: string, options?: any): Promise<void>;
    /**
     * 写入文件
     */
    static writeFile(filePath: string, content: string): Promise<void>;
    /**
     * 读取文件
     */
    static readFile(filePath: string): Promise<string>;
    /**
     * 检查文件是否存在
     */
    static exists(filePath: string): Promise<boolean>;
    /**
     * 获取文件状态
     */
    static stat(filePath: string): Promise<fs.Stats>;
    /**
     * 获取文件扩展名
     */
    static getExt(filePath: string): string;
    /**
     * 获取文件名（不含扩展名）
     */
    static getBaseName(filePath: string): string;
    /**
     * 获取文件所在目录
     */
    static getDir(filePath: string): string;
    /**
     * 获取相对路径
     */
    static getRelative(from: string, to: string): string;
    /**
     * 获取绝对路径
     */
    static getAbsolute(filePath: string): string;
    /**
     * 连接路径
     */
    static join(...paths: string[]): string;
    /**
     * 查找文件（使用glob模式）
     */
    static glob(pattern: string, options?: any): Promise<string[]>;
    /**
     * 获取目录中的所有文件
     */
    static getFiles(dir: string, recursive?: boolean): Promise<string[]>;
    /**
     * 获取目录中的所有Markdown文件
     */
    static getMarkdownFiles(dir: string): Promise<string[]>;
    /**
     * 创建目录结构
     */
    static createDirStructure(basePath: string, structure: string[]): Promise<void>;
    /**
     * 计算文件大小
     */
    static getFileSize(filePath: string): Promise<number>;
    /**
     * 格式化文件大小
     */
    static formatFileSize(bytes: number): string;
}
//# sourceMappingURL=file.d.ts.map