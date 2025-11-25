import { logger } from '../utils';
import { MarkdownParser } from '../core';
import { Post } from '../types';
import { FileUtils } from '../utils/file';

export class PostManager {
  private parser: MarkdownParser;
  private posts: Post[] = [];

  constructor() {
    this.parser = new MarkdownParser();
  }

  /**
   * 加载所有文章
   */
  async loadPosts(postsDir: string): Promise<Post[]> {
    logger.info(`Loading posts from: ${postsDir}`);

    try {
      // 获取所有Markdown文件
      const files = await FileUtils.getMarkdownFiles(postsDir);
      logger.info(`Found ${files.length} markdown files`);

      // 解析所有文章
      const posts: Post[] = [];
      for (const file of files) {
        try {
          const post = await this.parser.parse(file);
          if (!post.draft) {
            posts.push(post);
          } else {
            logger.debug(`Skipped draft post: ${post.title}`);
          }
        } catch (error) {
          logger.error(`Failed to parse post: ${file}`, error);
        }
      }

      // 按日期排序（最新的在前）
      posts.sort((a, b) => b.date.getTime() - a.date.getTime());

      this.posts = posts;
      logger.success(`Loaded ${posts.length} posts`);

      return posts;
    } catch (error) {
      logger.error('Failed to load posts', error);
      throw error;
    }
  }

  /**
   * 获取所有文章
   */
  getAllPosts(): Post[] {
    return [...this.posts];
  }

  /**
   * 获取分页文章
   */
  getPostsByPage(page: number, perPage: number): Post[] {
    const start = (page - 1) * perPage;
    const end = start + perPage;
    return this.posts.slice(start, end);
  }

  /**
   * 获取总页数
   */
  getTotalPages(perPage: number): number {
    return Math.ceil(this.posts.length / perPage);
  }

  /**
   * 根据分类获取文章
   */
  getPostsByCategory(category: string): Post[] {
    return this.posts.filter(post => post.category === category);
  }

  /**
   * 根据标签获取文章
   */
  getPostsByTag(tag: string): Post[] {
    return this.posts.filter(post => post.tags.includes(tag));
  }

  /**
   * 根据日期获取文章
   */
  getPostsByDate(year: number, month?: number): Post[] {
    return this.posts.filter(post => {
      const postYear = post.date.getFullYear();
      const postMonth = post.date.getMonth() + 1;

      if (month) {
        return postYear === year && postMonth === month;
      }
      return postYear === year;
    });
  }

  /**
   * 搜索文章
   */
  searchPosts(query: string): Post[] {
    const searchTerm = query.toLowerCase();

    return this.posts.filter(post => {
      const titleMatch = post.title.toLowerCase().includes(searchTerm);
      const contentMatch = post.content.toLowerCase().includes(searchTerm);
      const tagMatch = post.tags.some(tag =>
        tag.toLowerCase().includes(searchTerm)
      );
      const categoryMatch =
        post.category?.toLowerCase().includes(searchTerm) || false;
      const descriptionMatch =
        post.description?.toLowerCase().includes(searchTerm) || false;

      return (
        titleMatch ||
        contentMatch ||
        tagMatch ||
        categoryMatch ||
        descriptionMatch
      );
    });
  }

  /**
   * 获取所有分类
   */
  getCategories(): Array<{ name: string; count: number; posts: Post[] }> {
    const categoryMap = new Map<string, Post[]>();

    this.posts.forEach(post => {
      if (post.category) {
        if (!categoryMap.has(post.category)) {
          categoryMap.set(post.category, []);
        }
        categoryMap.get(post.category)!.push(post);
      }
    });

    return Array.from(categoryMap.entries()).map(([name, posts]) => ({
      name,
      count: posts.length,
      posts,
    }));
  }

  /**
   * 获取所有标签
   */
  getTags(): Array<{ name: string; count: number; posts: Post[] }> {
    const tagMap = new Map<string, Post[]>();

    this.posts.forEach(post => {
      post.tags.forEach(tag => {
        if (!tagMap.has(tag)) {
          tagMap.set(tag, []);
        }
        tagMap.get(tag)!.push(post);
      });
    });

    return Array.from(tagMap.entries()).map(([name, posts]) => ({
      name,
      count: posts.length,
      posts,
    }));
  }

  /**
   * 获取归档数据
   */
  getArchives(): Array<{
    year: number;
    month: number;
    count: number;
    posts: Post[];
  }> {
    const archiveMap = new Map<string, Post[]>();

    this.posts.forEach(post => {
      const year = post.date.getFullYear();
      const month = post.date.getMonth() + 1;
      const key = `${year}-${month}`;

      if (!archiveMap.has(key)) {
        archiveMap.set(key, []);
      }
      archiveMap.get(key)!.push(post);
    });

    return Array.from(archiveMap.entries())
      .map(([key, posts]) => {
        const [year, month] = key.split('-').map(Number);
        return {
          year,
          month,
          count: posts.length,
          posts,
        };
      })
      .sort((a, b) => {
        if (a.year !== b.year) return b.year - a.year;
        return b.month - a.month;
      });
  }

  /**
   * 获取相邻文章
   */
  getAdjacentPosts(currentPost: Post): { prev?: Post; next?: Post } {
    const currentIndex = this.posts.findIndex(
      post => post.slug === currentPost.slug
    );

    if (currentIndex === -1) {
      return {};
    }

    return {
      prev: currentIndex > 0 ? this.posts[currentIndex - 1] : undefined,
      next:
        currentIndex < this.posts.length - 1
          ? this.posts[currentIndex + 1]
          : undefined,
    };
  }

  /**
   * 获取相关文章
   */
  getRelatedPosts(currentPost: Post, limit: number = 5): Post[] {
    const relatedPosts = this.posts.filter(post => {
      if (post.slug === currentPost.slug) return false;

      // 检查是否有相同的标签
      const hasCommonTags = post.tags.some(tag =>
        currentPost.tags.includes(tag)
      );

      // 检查是否属于相同的分类
      const hasSameCategory = post.category === currentPost.category;

      return hasCommonTags || hasSameCategory;
    });

    // 按日期排序并限制数量
    return relatedPosts
      .sort((a, b) => b.date.getTime() - a.date.getTime())
      .slice(0, limit);
  }

  /**
   * 获取最新文章
   */
  getRecentPosts(limit: number = 5): Post[] {
    return this.posts.slice(0, limit);
  }

  /**
   * 获取热门文章（基于阅读量，这里简化处理）
   */
  getPopularPosts(limit: number = 5): Post[] {
    // 这里可以实现更复杂的逻辑，比如基于阅读量、评论数等
    // 目前简单地返回最新的文章
    return this.getRecentPosts(limit);
  }

  /**
   * 按年份获取文章统计
   */
  getPostsByYear(): Array<{ year: number; count: number; posts: Post[] }> {
    const yearMap = new Map<number, Post[]>();

    this.posts.forEach(post => {
      const year = post.date.getFullYear();
      if (!yearMap.has(year)) {
        yearMap.set(year, []);
      }
      yearMap.get(year)!.push(post);
    });

    return Array.from(yearMap.entries())
      .map(([year, posts]) => ({
        year,
        count: posts.length,
        posts,
      }))
      .sort((a, b) => b.year - a.year);
  }

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
  } {
    const totalWords = this.posts.reduce(
      (sum, post) => sum + (post.wordCount || 0),
      0
    );
    const totalReadingTime = this.posts.reduce(
      (sum, post) => sum + (post.readingTime || 0),
      0
    );
    const categories = this.getCategories().length;
    const tags = this.getTags().length;
    const archives = this.getArchives().length;

    return {
      totalPosts: this.posts.length,
      totalWords,
      totalReadingTime,
      categories,
      tags,
      archives,
    };
  }
}
