"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BuildCommand = void 0;
const core_1 = require("../core");
const utils_1 = require("../utils");
const config_1 = require("../utils/config");
class BuildCommand {
    constructor(config) {
        this.config = config || (0, config_1.loadConfig)();
        this.generator = new core_1.StaticGenerator(this.config);
    }
    /**
     * 执行构建命令
     */
    async execute() {
        utils_1.logger.info('Starting build process...');
        utils_1.logger.time('Build time');
        try {
            // 生成静态网站
            const result = await this.generator.generate();
            utils_1.logger.timeEnd('Build time');
            utils_1.logger.success(`Build completed successfully!`);
            utils_1.logger.info(`Generated ${result.posts.length} posts`);
            utils_1.logger.info(`Generated ${result.categories.length} categories`);
            utils_1.logger.info(`Generated ${result.tags.length} tags`);
            utils_1.logger.info(`Generated ${result.archives.length} archives`);
            if (result.rss) {
                utils_1.logger.info(`Generated RSS feed: ${result.rss}`);
            }
            if (result.sitemap) {
                utils_1.logger.info(`Generated sitemap: ${result.sitemap}`);
            }
        }
        catch (error) {
            utils_1.logger.error('Build failed', error);
            process.exit(1);
        }
    }
}
exports.BuildCommand = BuildCommand;
// CLI入口点
if (require.main === module) {
    const buildCommand = new BuildCommand();
    buildCommand.execute().catch(error => {
        utils_1.logger.error('Build command failed', error);
        process.exit(1);
    });
}
//# sourceMappingURL=build.js.map