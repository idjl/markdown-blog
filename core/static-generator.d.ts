import { BlogConfig, BuildResult } from '../types';
export declare class StaticGenerator {
    private config;
    private postManager;
    private templateEngine;
    constructor(config: BlogConfig);
    /**
     * 生成静态网站
     */
    generate(): Promise<BuildResult>;
    /**
     * 加载文章
     */
    private loadPosts;
    /**
     * 生成所有页面
     */
    private generatePages;
    /**
     * 生成首页
     */
    private generateHomePages;
    /**
     * 生成文章页面
     */
    private generatePostPages;
    /**
     * 生成分类页面
     */
    private generateCategoryPages;
    /**
     * 生成标签页面
     */
    private generateTagPages;
    /**
     * 生成归档页面
     */
    private generateArchivePages;
    /**
     * 生成搜索页面
     */
    private generateSearchPage;
    /**
     * 生成404页面
     */
    private generate404Page;
    /**
     * 复制静态资源
     */
    private copyAssets;
    /**
     * 生成资源文件
     */
    private generateAssets;
    /**
     * 生成CSS文件
     */
    private generateCSS;
    /**
     * 生成主CSS
     */
    private generateMainCSS;
    /**
     * 生成Prism.js CSS
     */
    private generatePrismCSS;
    /**
     * 生成JavaScript文件
     */
    private generateJS;
    /**
     * 生成主JavaScript
     */
    private generateMainJS;
    /**
     * 生成Prism.js
     */
    private generatePrismJS;
    /**
     * 生成搜索JavaScript
     */
    private generateSearchJS;
    /**
     * 生成CNAME文件
     */
    private generateCNAME;
    /**
     * 生成RSS订阅
     */
    private generateRSS;
    /**
     * 生成站点地图
     */
    private generateSitemap;
    /**
     * 生成搜索索引
     */
    private generateSearchIndex;
    /**
     * 获取生成的页面列表
     */
    private getGeneratedPages;
}
//# sourceMappingURL=static-generator.d.ts.map