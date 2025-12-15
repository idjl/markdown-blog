"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DevCommand = void 0;
const core_1 = require("../core");
const utils_1 = require("../utils");
const config_1 = require("../utils/config");
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const chokidar_1 = __importDefault(require("chokidar"));
class DevCommand {
    constructor(config) {
        this.watcher = null;
        this.config = config || (0, config_1.loadConfig)();
        this.generator = new core_1.StaticGenerator(this.config);
        this.app = (0, express_1.default)();
    }
    /**
     * 执行开发命令
     */
    async execute(options = {}) {
        const port = options.port || this.config.dev.port;
        const host = options.host || this.config.dev.host;
        const open = options.open !== undefined ? options.open : this.config.dev.open;
        utils_1.logger.info(`Starting development server on ${host}:${port}...`);
        try {
            // 初始构建
            await this.build();
            // 设置Express服务器
            this.setupServer();
            // 设置文件监听
            this.setupWatcher();
            // 启动服务器
            await this.startServer(port, host, open);
            utils_1.logger.success(`Development server started on http://${host}:${port}`);
        }
        catch (error) {
            utils_1.logger.error('Failed to start development server', error);
            process.exit(1);
        }
    }
    /**
     * 构建网站
     */
    async build() {
        utils_1.logger.info('Building site...');
        try {
            await this.generator.generate();
            utils_1.logger.success('Build completed');
        }
        catch (error) {
            utils_1.logger.error('Build failed', error);
            throw error;
        }
    }
    /**
     * 设置Express服务器
     */
    setupServer() {
        // 静态文件服务
        this.app.use(express_1.default.static(this.config.build.outputDir));
        // SPA支持 - 所有未匹配的路由都返回index.html
        this.app.get('*', (req, res) => {
            const root = process.cwd();
            let requestPath = req.path || '/';
            if (requestPath.startsWith('/'))
                requestPath = requestPath.slice(1);
            // 尝试找到对应的文件（使用相对路径并指定root）
            let relPath = path_1.default.join(this.config.build.outputDir, requestPath);
            // 如果是目录，尝试index.html
            if (req.path.endsWith('/')) {
                relPath = path_1.default.join(relPath, 'index.html');
            }
            else if (!req.path.includes('.')) {
                // 如果没有扩展名，尝试添加.html
                relPath = relPath + '.html';
            }
            const absPath = path_1.default.resolve(root, relPath);
            // 检查文件是否存在
            if (fs_1.default.existsSync(absPath)) {
                res.sendFile(absPath);
            }
            else {
                // 返回404页面
                const notFoundAbs = path_1.default.resolve(root, this.config.build.outputDir, '404.html');
                if (fs_1.default.existsSync(notFoundAbs)) {
                    res.status(404).sendFile(notFoundAbs);
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
     * 设置文件监听
     */
    setupWatcher() {
        const postsDir = path_1.default.resolve(process.cwd(), 'posts');
        const templatesDir = path_1.default.resolve(process.cwd(), 'src/templates');
        const publicDir = path_1.default.resolve(process.cwd(), 'public');
        this.watcher = chokidar_1.default.watch([postsDir, templatesDir, publicDir], {
            ignored: /(^|[/\\])\../, // 忽略隐藏文件
            persistent: true,
            usePolling: true,
            ignoreInitial: true,
        });
        this.watcher.on('change', async (filePath) => {
            utils_1.logger.info(`File changed: ${filePath}`);
            try {
                await this.build();
                utils_1.logger.success('Site rebuilt successfully');
            }
            catch (error) {
                utils_1.logger.error('Rebuild failed', error);
            }
        });
        this.watcher.on('add', async (filePath) => {
            utils_1.logger.info(`File added: ${filePath}`);
            try {
                await this.build();
                utils_1.logger.success('Site rebuilt successfully');
            }
            catch (error) {
                utils_1.logger.error('Rebuild failed', error);
            }
        });
        this.watcher.on('unlink', async (filePath) => {
            utils_1.logger.info(`File removed: ${filePath}`);
            try {
                await this.build();
                utils_1.logger.success('Site rebuilt successfully');
            }
            catch (error) {
                utils_1.logger.error('Rebuild failed', error);
            }
        });
        utils_1.logger.info('File watcher started');
    }
    /**
     * 启动服务器
     */
    async startServer(port, host, open) {
        return new Promise((resolve, reject) => {
            this.server = this.app.listen(port, host, (error) => {
                if (error) {
                    reject(error);
                }
                else {
                    if (open) {
                        // 打开浏览器
                        const openBrowser = async () => {
                            utils_1.logger.info(`Server running at http://${host}:${port}`);
                            utils_1.logger.info('Open your browser to view the site');
                        };
                        openBrowser().catch(() => {
                            // 忽略打开浏览器失败
                        });
                    }
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
                    utils_1.logger.info('Development server stopped');
                    resolve();
                });
            });
        }
        if (this.watcher) {
            await this.watcher.close();
            utils_1.logger.info('File watcher stopped');
        }
    }
}
exports.DevCommand = DevCommand;
//# sourceMappingURL=dev.js.map