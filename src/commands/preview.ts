import { BlogConfig } from '../types';
import { logger } from '../utils';
import { loadConfig } from '../utils/config';
import express from 'express';
import path from 'path';

interface PreviewOptions {
  port?: number;
  host?: string;
}

export class PreviewCommand {
  private config: BlogConfig;
  private app: express.Application;
  private server: any;

  constructor(config?: BlogConfig) {
    this.config = config || loadConfig();
    this.app = express();
  }

  /**
   * 执行预览命令
   */
  async execute(options: PreviewOptions = {}): Promise<void> {
    const port = options.port || 4000;
    const host = options.host || 'localhost';

    logger.info(`Starting preview server on ${host}:${port}...`);

    try {
      // 检查构建目录是否存在
      const distDir = path.resolve(process.cwd(), this.config.build.outputDir);
      const fs = require('fs');
      
      if (!fs.existsSync(distDir)) {
        logger.error(`Build directory does not exist: ${distDir}`);
        logger.info('Please run "npm run build" first');
        process.exit(1);
      }

      // 设置Express服务器
      this.setupServer();

      // 启动服务器
      await this.startServer(port, host);

      logger.success(`Preview server started on http://${host}:${port}`);
      logger.info('Press Ctrl+C to stop the server');
    } catch (error) {
      logger.error('Failed to start preview server', error);
      process.exit(1);
    }
  }

  /**
   * 设置Express服务器
   */
  private setupServer(): void {
    const distDir = path.resolve(process.cwd(), this.config.build.outputDir);

    // 静态文件服务
    this.app.use(express.static(distDir));

    // SPA支持 - 所有未匹配的路由都返回index.html
    this.app.get('*', (req, res) => {
      const fs = require('fs');
      const path = require('path');
      
      // 尝试找到对应的文件
      let filePath = path.join(distDir, req.path);
      
      // 如果是目录，尝试index.html
      if (req.path.endsWith('/')) {
        filePath = path.join(filePath, 'index.html');
      } else if (!req.path.includes('.')) {
        // 如果没有扩展名，尝试添加.html
        filePath = filePath + '.html';
      }
      
      // 检查文件是否存在
      if (fs.existsSync(filePath)) {
        res.sendFile(filePath);
      } else {
        // 返回404页面
        const notFoundPath = path.join(distDir, '404.html');
        if (fs.existsSync(notFoundPath)) {
          res.status(404).sendFile(notFoundPath);
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
   * 启动服务器
   */
  private async startServer(port: number, host: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.server = this.app.listen(port, host, (error?: Error) => {
        if (error) {
          reject(error);
        } else {
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
      return new Promise((resolve) => {
        this.server.close(() => {
          logger.info('Preview server stopped');
          resolve();
        });
      });
    }
  }
}