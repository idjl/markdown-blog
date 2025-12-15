import { Post, Category, Tag, Archive } from '../types';
export declare class DataProcessor {
    /**
     * 处理文章数据，生成分类、标签、归档等统计信息
     */
    static processPosts(posts: Post[]): {
        categories: Category[];
        tags: Tag[];
        archives: Archive[];
        stats: any;
    };
    /**
     * 处理分类数据
     */
    private static processCategories;
    /**
     * 处理标签数据
     */
    private static processTags;
    /**
     * 处理归档数据
     */
    private static processArchives;
    /**
     * 生成统计信息
     */
    private static generateStats;
    /**
     * 生成URL友好的slug
     */
    private static generateSlug;
    /**
     * 生成分类页面数据
     */
    static generateCategoryPages(categories: Category[], postsPerPage: number): Array<{
        category: Category;
        page: number;
        totalPages: number;
        posts: Post[];
    }>;
    /**
     * 生成标签页面数据
     */
    static generateTagPages(tags: Tag[], postsPerPage: number): Array<{
        tag: Tag;
        page: number;
        totalPages: number;
        posts: Post[];
    }>;
    /**
     * 生成归档页面数据
     */
    static generateArchivePages(archives: Archive[], postsPerPage: number): Array<{
        archive: Archive;
        page: number;
        totalPages: number;
        posts: Post[];
    }>;
    /**
     * 生成首页分页数据
     */
    static generateHomePages(posts: Post[], postsPerPage: number): Array<{
        page: number;
        totalPages: number;
        posts: Post[];
    }>;
}
//# sourceMappingURL=data-processor.d.ts.map