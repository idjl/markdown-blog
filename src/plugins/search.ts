import { Post } from '../types';
import { FileUtils } from '../utils';
import path from 'path';

/**
 * 生成搜索索引
 */
export class SearchIndexGenerator {
  /**
   * 生成搜索索引
   */
  static async generate(posts: Post[], outputDir: string): Promise<void> {
    const searchIndex = posts.map(post => ({
      title: post.title,
      content: this.stripHtml(post.content),
      excerpt: post.excerpt,
      url: post.url,
      date: post.date.toISOString(),
      tags: post.tags,
      category: post.category,
      author: post.author,
      readingTime: post.readingTime,
      wordCount: post.wordCount,
    }));

    const searchIndexPath = path.join(outputDir, 'search-index.json');
    await FileUtils.writeFile(
      searchIndexPath,
      JSON.stringify(searchIndex, null, 2)
    );
  }

  /**
   * 移除HTML标签
   */
  private static stripHtml(html: string): string {
    return html
      .replace(/<[^>]*>/g, '')
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .trim();
  }
}
