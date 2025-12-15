"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PreviewCommand = void 0;
const utils_1 = require("../utils");
const config_1 = require("../utils/config");
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
class PreviewCommand {
    constructor(config) {
        this.config = config || (0, config_1.loadConfig)();
        this.app = (0, express_1.default)();
    }
    /**
     * 执行预览命令
     */
    async execute(options = {}) {
        const port = options.port || 4000;
        const host = options.host || 'localhost';
        utils_1.logger.info(`Starting preview server on ${host}:${port}...`);
        try {
            // 检查构建目录是否存在
            const distDir = path_1.default.resolve(process.cwd(), this.config.build.outputDir);
            if (!fs_1.default.existsSync(distDir)) {
                utils_1.logger.error(`Build directory does not exist: ${distDir}`);
                utils_1.logger.info('Please run "npm run build" first');
                process.exit(1);
            }
            // 设置Express服务器
            this.setupServer();
            // 启动服务器
            await this.startServer(port, host);
            utils_1.logger.success(`Preview server started on http://${host}:${port}`);
            utils_1.logger.info('Press Ctrl+C to stop the server');
        }
        catch (error) {
            utils_1.logger.error('Failed to start preview server', error);
            process.exit(1);
        }
    }
    /**
     * 设置Express服务器
     */
    setupServer() {
        const distDir = path_1.default.resolve(process.cwd(), this.config.build.outputDir);
        // 静态文件服务
        this.app.use(express_1.default.static(distDir));
        // SPA支持 - 所有未匹配的路由都返回index.html
        this.app.get('*', (req, res) => {
            // 尝试找到对应的文件
            let filePath = path_1.default.join(distDir, req.path);
            // 如果是目录，尝试index.html
            if (req.path.endsWith('/')) {
                filePath = path_1.default.join(filePath, 'index.html');
            }
            else if (!req.path.includes('.')) {
                // 如果没有扩展名，尝试添加.html
                filePath = filePath + '.html';
            }
            // 检查文件是否存在
            if (fs_1.default.existsSync(filePath)) {
                res.sendFile(filePath);
            }
            else {
                // 返回404页面
                const notFoundPath = path_1.default.join(distDir, '404.html');
                if (fs_1.default.existsSync(notFoundPath)) {
                    res.status(404).sendFile(notFoundPath);
                }
                else {
                    res.status(404).send(`
            <!DOCTYPE html>
            <html>
            <head>
              <title>404 - 页面未找到</title>
              <style>
                body { font-family: Arial, sans-serif; text-align: center; padding: 50px; }
                h1 { color: #e74c3c; }
                a { color: #3498db; text-decoration: none; }
                a:hover { text-decoration: underline; }
              </style>
            </head>
            <body>
              <h1>404 - 页面未找到</h1>
              <p>抱歉，您访问的页面不存在。</p>
              <p><a href="/">返回首页</a></p>
            </body>
            </html>
          `);
                }
            }
        });
    }
    /**
     * 启动服务器
     */
    async startServer(port, host) {
        return new Promise((resolve, reject) => {
            this.server = this.app.listen(port, host, (error) => {
                if (error) {
                    reject(error);
                }
                else {
                    resolve();
                }
            });
        });
    }
    /**
     * 停止服务器
     */
    async stop() {
        if (this.server) {
            return new Promise(resolve => {
                this.server.close(() => {
                    utils_1.logger.info('Preview server stopped');
                    resolve();
                });
            });
        }
    }
}
exports.PreviewCommand = PreviewCommand;
//# sourceMappingURL=preview.js.map