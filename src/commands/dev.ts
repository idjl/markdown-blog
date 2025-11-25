import { BlogConfig } from '../types';
import { StaticGenerator } from '../core';
import { logger } from '../utils';
import { loadConfig } from '../utils/config';
import express from 'express';
import path from 'path';
import fs from 'fs';
import chokidar from 'chokidar';

interface DevOptions {
  port?: number;
  host?: string;
  open?: boolean;
}

export class DevCommand {
  private config: BlogConfig;
  private generator: StaticGenerator;
  private app: express.Application;
  private server: any;
  private watcher: chokidar.FSWatcher | null = null;

  constructor(config?: BlogConfig) {
    this.config = config || loadConfig();
    this.generator = new StaticGenerator(this.config);
    this.app = express();
  }

  /**
   * 执行开发命令
   */
  async execute(options: DevOptions = {}): Promise<void> {
    const port = options.port || this.config.dev.port;
    const host = options.host || this.config.dev.host;
    const open =
      options.open !== undefined ? options.open : this.config.dev.open;

    logger.info(`Starting development server on ${host}:${port}...`);

    try {
      // 初始构建
      await this.build();

      // 设置Express服务器
      this.setupServer();

      // 设置文件监听
      this.setupWatcher();

      // 启动服务器
      await this.startServer(port, host, open);

      logger.success(`Development server started on http://${host}:${port}`);
    } catch (error) {
      logger.error('Failed to start development server', error);
      process.exit(1);
    }
  }

  /**
   * 构建网站
   */
  private async build(): Promise<void> {
    logger.info('Building site...');

    try {
      await this.generator.generate();
      logger.success('Build completed');
    } catch (error) {
      logger.error('Build failed', error);
      throw error;
    }
  }

  /**
   * 设置Express服务器
   */
  private setupServer(): void {
    // 静态文件服务
    this.app.use(express.static(this.config.build.outputDir));

    // SPA支持 - 所有未匹配的路由都返回index.html
    this.app.get('*', (req, res) => {
      const root = process.cwd();
      let requestPath = req.path || '/';
      if (requestPath.startsWith('/')) requestPath = requestPath.slice(1);

      // 尝试找到对应的文件（使用相对路径并指定root）
      let relPath = path.join(this.config.build.outputDir, requestPath);

      // 如果是目录，尝试index.html
      if (req.path.endsWith('/')) {
        relPath = path.join(relPath, 'index.html');
      } else if (!req.path.includes('.')) {
        // 如果没有扩展名，尝试添加.html
        relPath = relPath + '.html';
      }

      const absPath = path.resolve(root, relPath);

      // 检查文件是否存在
      if (fs.existsSync(absPath)) {
        res.sendFile(absPath);
      } else {
        // 返回404页面
        const notFoundAbs = path.resolve(
          root,
          this.config.build.outputDir,
          '404.html'
        );
        if (fs.existsSync(notFoundAbs)) {
          res.status(404).sendFile(notFoundAbs);
        } else {
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
  private setupWatcher(): void {
    const postsDir = path.resolve(process.cwd(), 'posts');
    const templatesDir = path.resolve(process.cwd(), 'src/templates');
    const publicDir = path.resolve(process.cwd(), 'public');

    this.watcher = chokidar.watch([postsDir, templatesDir, publicDir], {
      ignored: /(^|[/\\])\../, // 忽略隐藏文件
      persistent: true,
      usePolling: true,
      ignoreInitial: true,
    });

    this.watcher.on('change', async filePath => {
      logger.info(`File changed: ${filePath}`);

      try {
        await this.build();
        logger.success('Site rebuilt successfully');
      } catch (error) {
        logger.error('Rebuild failed', error);
      }
    });

    this.watcher.on('add', async filePath => {
      logger.info(`File added: ${filePath}`);

      try {
        await this.build();
        logger.success('Site rebuilt successfully');
      } catch (error) {
        logger.error('Rebuild failed', error);
      }
    });

    this.watcher.on('unlink', async filePath => {
      logger.info(`File removed: ${filePath}`);

      try {
        await this.build();
        logger.success('Site rebuilt successfully');
      } catch (error) {
        logger.error('Rebuild failed', error);
      }
    });

    logger.info('File watcher started');
  }

  /**
   * 启动服务器
   */
  private async startServer(
    port: number,
    host: string,
    open: boolean
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      this.server = this.app.listen(port, host, (error?: Error) => {
        if (error) {
          reject(error);
        } else {
          if (open) {
            // 打开浏览器
            const openBrowser = async () => {
              logger.info(`Server running at http://${host}:${port}`);
              logger.info('Open your browser to view the site');
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
  async stop(): Promise<void> {
    if (this.server) {
      return new Promise(resolve => {
        this.server.close(() => {
          logger.info('Development server stopped');
          resolve();
        });
      });
    }

    if (this.watcher) {
      await this.watcher.close();
      logger.info('File watcher stopped');
    }
  }
}
