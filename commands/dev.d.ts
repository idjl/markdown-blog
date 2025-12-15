import { BlogConfig } from '../types';
interface DevOptions {
    port?: number;
    host?: string;
    open?: boolean;
}
export declare class DevCommand {
    private config;
    private generator;
    private app;
    private server;
    private watcher;
    constructor(config?: BlogConfig);
    /**
     * 执行开发命令
     */
    execute(options?: DevOptions): Promise<void>;
    /**
     * 构建网站
     */
    private build;
    /**
     * 设置Express服务器
     */
    private setupServer;
    /**
     * 设置文件监听
     */
    private setupWatcher;
    /**
     * 启动服务器
     */
    private startServer;
    /**
     * 停止服务器
     */
    stop(): Promise<void>;
}
export {};
//# sourceMappingURL=dev.d.ts.map