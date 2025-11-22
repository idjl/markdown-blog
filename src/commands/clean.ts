import { FileUtils, logger } from '../utils';
import path from 'path';

export class CleanCommand {
  /**
   * 执行清理命令
   */
  async execute(): Promise<void> {
    logger.info('Starting clean process...');

    try {
      const distDir = path.resolve(process.cwd(), 'dist');
      
      if (await FileUtils.exists(distDir)) {
        await FileUtils.removeDir(distDir);
        logger.success('Cleaned build directory');
      } else {
        logger.info('Build directory does not exist');
      }
    } catch (error) {
      logger.error('Clean failed', error);
      throw error;
    }
  }
}