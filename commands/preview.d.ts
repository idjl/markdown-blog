import { BlogConfig } from '../types';
interface PreviewOptions {
    port?: number;
    host?: string;
}
export declare class PreviewCommand {
    private config;
    private app;
    private server;
    constructor(config?: BlogConfig);
    /**
     * 执行预览命令
     */
    execute(options?: PreviewOptions): Promise<void>;
    /**
     * 设置Express服务器
     */
    private setupServer;
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
//# sourceMappingURL=preview.d.ts.map