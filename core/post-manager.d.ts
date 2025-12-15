import { Post } from '../types';
export declare class PostManager {
    private parser;
    private posts;
    constructor();
    /**
     * 加载所有文章
     */
    loadPosts(postsDir: string): Promise<Post[]>;
    /**
     * 获取所有文章
     */
    getAllPosts(): Post[];
    /**
     * 获取分页文章
     */
    getPostsByPage(page: number, perPage: number): Post[];
    /**
     * 获取总页数
     */
    getTotalPages(perPage: number): number;
    /**
     * 根据分类获取文章
     */
    getPostsByCategory(category: string): Post[];
    /**
     * 根据标签获取文章
     */
    getPostsByTag(tag: string): Post[];
    /**
     * 根据日期获取文章
     */
    getPostsByDate(year: number, month?: number): Post[];
    /**
     * 搜索文章
     */
    searchPosts(query: string): Post[];
    /**
     * 获取所有分类
     */
    getCategories(): Array<{
        name: string;
        count: number;
        posts: Post[];
    }>;
    /**
     * 获取所有标签
     */
    getTags(): Array<{
        name: string;
        count: number;
        posts: Post[];
    }>;
    /**
     * 获取归档数据
     */
    getArchives(): Array<{
        year: number;
        month: number;
        count: number;
        posts: Post[];
    }>;
    /**
     * 获取相邻文章
     */
    getAdjacentPosts(currentPost: Post): {
        prev?: Post;
        next?: Post;
    };
    /**
     * 获取相关文章
     */
    getRelatedPosts(currentPost: Post, limit?: number): Post[];
    /**
     * 获取最新文章
     */
    getRecentPosts(limit?: number): Post[];
    /**
     * 获取热门文章（基于阅读量，这里简化处理）
     */
    getPopularPosts(limit?: number): Post[];
    /**
     * 按年份获取文章统计
     */
    getPostsByYear(): Array<{
        year: number;
        count: number;
        posts: Post[];
    }>;
    /**
     * 获取文章统计信息
     */
    getStats(): {
        totalPosts: number;
        totalWords: number;
        totalReadingTime: number;
        categories: number;
        tags: number;
        archives: number;
    };
}
//# sourceMappingURL=post-manager.d.ts.map