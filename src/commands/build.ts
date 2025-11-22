import { BlogConfig } from '../types';
import { StaticGenerator } from '../core';
import { logger } from '../utils';
import { loadConfig } from '../utils/config';

export class BuildCommand {
  private config: BlogConfig;
  private generator: StaticGenerator;

  constructor(config?: BlogConfig) {
    this.config = config || loadConfig();
    this.generator = new StaticGenerator(this.config);
  }

  /**
   * 执行构建命令
   */
  async execute(): Promise<void> {
    logger.info('Starting build process...');
    logger.time('Build time');

    try {
      // 生成静态网站
      const result = await this.generator.generate();
      
      logger.timeEnd('Build time');
      logger.success(`Build completed successfully!`);
      logger.info(`Generated ${result.posts.length} posts`);
      logger.info(`Generated ${result.categories.length} categories`);
      logger.info(`Generated ${result.tags.length} tags`);
      logger.info(`Generated ${result.archives.length} archives`);
      
      if (result.rss) {
        logger.info(`Generated RSS feed: ${result.rss}`);
      }
      
      if (result.sitemap) {
        logger.info(`Generated sitemap: ${result.sitemap}`);
      }
    } catch (error) {
      logger.error('Build failed', error);
      process.exit(1);
    }
  }
}

// CLI入口点
if (require.main === module) {
  const buildCommand = new BuildCommand();
  buildCommand.execute().catch((error) => {
    logger.error('Build command failed', error);
    process.exit(1);
  });
}