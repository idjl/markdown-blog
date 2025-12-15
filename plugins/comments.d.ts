import { BlogConfig } from '../types';
/**
 * 评论系统插件
 */
export declare class CommentsPlugin {
    private config;
    constructor(config: BlogConfig);
    /**
     * 应用插件
     */
    apply(context: any): void;
    /**
     * 设置 Utterances
     */
    private setupUtterances;
    /**
     * 设置 Giscus
     */
    private setupGiscus;
    /**
     * 获取评论脚本
     */
    getCommentsScript(): string;
}
//# sourceMappingURL=comments.d.ts.map