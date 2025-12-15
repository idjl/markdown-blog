import { Post } from '../types';
/**
 * 生成搜索索引
 */
export declare class SearchIndexGenerator {
    /**
     * 生成搜索索引
     */
    static generate(posts: Post[], outputDir: string): Promise<void>;
    /**
     * 移除HTML标签
     */
    private static stripHtml;
}
//# sourceMappingURL=search.d.ts.map