import { Post, FrontMatter } from '../types';
import matter from 'gray-matter';
import MarkdownIt from 'markdown-it';
import anchor from 'markdown-it-anchor';
import tableOfContents from 'markdown-it-table-of-contents';
import taskLists from 'markdown-it-task-lists';
import footnote from 'markdown-it-footnote';
import mark from 'markdown-it-mark';
import ins from 'markdown-it-ins';
import sub from 'markdown-it-sub';
import sup from 'markdown-it-sup';
import abbr from 'markdown-it-abbr';
import deflist from 'markdown-it-deflist';
import container from 'markdown-it-container';
import emoji from 'markdown-it-emoji';
import fs from 'fs-extra';
import path from 'path';
import dayjs from 'dayjs';

export class MarkdownParser {
  private md: MarkdownIt;

  constructor() {
    this.md = new MarkdownIt({
      html: true,
      linkify: true,
      typographer: true,
      breaks: false,
    });

    this.setupPlugins();
  }

  private setupPlugins(): void {
    // 锚点插件
    this.md.use(anchor, {
      permalink: anchor.permalink.headerLink(),
      permalinkBefore: true,
      permalinkClass: 'header-anchor',
      permalinkSymbol: '#',
      slugify: (str: string) =>
        str
          .toLowerCase()
          .replace(/[^\w\s-]/g, '')
          .replace(/\s+/g, '-'),
    });

    // 目录插件
    this.md.use(tableOfContents, {
      includeLevel: [2, 3, 4],
      containerClass: 'table-of-contents',
      markerPattern: /^\[\[toc\]\]/im,
      listType: 'ul',
      slugify: (str: string) =>
        str
          .toLowerCase()
          .replace(/[^\w\s-]/g, '')
          .replace(/\s+/g, '-'),
    });

    // 任务列表
    this.md.use(taskLists, {
      enabled: true,
      label: true,
      labelAfter: true,
    });

    // 脚注
    this.md.use(footnote);

    // 标记
    this.md.use(mark);

    // 插入
    this.md.use(ins);

    // 上标下标
    this.md.use(sub);
    this.md.use(sup);

    // 缩写
    this.md.use(abbr);

    // 定义列表
    this.md.use(deflist);

    // 容器
    this.md.use(container, 'tip', {
      render: (tokens: any[], idx: number) => {
        const m = tokens[idx].info.trim().match(/^tip\\s+(.*)$/);
        if (tokens[idx].nesting === 1) {
          return `<div class="custom-block tip"><p class="custom-block-title">${
            m ? m[1] : '提示'
          }</p>\n`;
        } else {
          return '</div>\n';
        }
      },
    });

    this.md.use(container, 'warning', {
      render: (tokens: any[], idx: number) => {
        const m = tokens[idx].info.trim().match(/^warning\\s+(.*)$/);
        if (tokens[idx].nesting === 1) {
          return `<div class="custom-block warning"><p class="custom-block-title">${
            m ? m[1] : '警告'
          }</p>\n`;
        } else {
          return '</div>\n';
        }
      },
    });

    this.md.use(container, 'danger', {
      render: (tokens: any[], idx: number) => {
        const m = tokens[idx].info.trim().match(/^danger\\s+(.*)$/);
        if (tokens[idx].nesting === 1) {
          return `<div class="custom-block danger"><p class="custom-block-title">${
            m ? m[1] : '危险'
          }</p>\n`;
        } else {
          return '</div>\n';
        }
      },
    });

    // 表情符号
    this.md.use(emoji);
  }

  async parse(filePath: string): Promise<Post> {
    const content = await fs.readFile(filePath, 'utf-8');
    const { data, content: markdownContent } = matter(content);
    
    const frontMatter = this.normalizeFrontMatter(data);
    const htmlContent = this.md.render(markdownContent);
    const excerpt = this.generateExcerpt(htmlContent);
    const wordCount = this.countWords(markdownContent);
    const readingTime = this.calculateReadingTime(wordCount);
    
    const slug = this.generateSlug(frontMatter.title, filePath);
    const url = `/posts/${slug}/`;
    
    return {
      title: frontMatter.title,
      slug,
      content: htmlContent,
      excerpt,
      date: new Date(frontMatter.date),
      updated: frontMatter.updated ? new Date(frontMatter.updated) : undefined,
      author: frontMatter.author,
      tags: Array.isArray(frontMatter.tags) ? frontMatter.tags : (frontMatter.tags ? [frontMatter.tags] : []),
      category: frontMatter.category,
      description: frontMatter.description,
      coverImage: frontMatter.coverImage,
      draft: frontMatter.draft || false,
      readingTime,
      wordCount,
      filePath,
      url,
    };
  }

  private normalizeFrontMatter(data: any): FrontMatter {
    const normalized = { ...data };
    
    // 标准化日期
    if (data.date) {
      normalized.date = dayjs(data.date).toDate();
    } else {
      normalized.date = new Date();
    }
    
    // 标准化更新日期
    if (data.updated) {
      normalized.updated = dayjs(data.updated).toDate();
    }
    
    // 标准化标签
    if (data.tags) {
      if (typeof data.tags === 'string') {
        normalized.tags = data.tags.split(',').map((tag: string) => tag.trim());
      } else if (Array.isArray(data.tags)) {
        normalized.tags = data.tags.map((tag: string) => tag.trim());
      }
    } else {
      normalized.tags = [];
    }
    
    // 标准化作者
    if (!data.author) {
      normalized.author = 'Anonymous';
    }
    
    return normalized;
  }

  private generateExcerpt(html: string, maxLength: number = 200): string {
    // 移除HTML标签
    const text = html.replace(/<[^>]*>/g, '');
    
    if (text.length <= maxLength) {
      return text;
    }
    
    // 截取前maxLength个字符，并在最后一个空格处截断
    const excerpt = text.substring(0, maxLength);
    const lastSpace = excerpt.lastIndexOf(' ');
    
    if (lastSpace > 0) {
      return excerpt.substring(0, lastSpace) + '...';
    }
    
    return excerpt + '...';
  }

  private countWords(content: string): number {
    const text = content.replace(/<[^>]*>/g, '');
    return text.trim().split(/\s+/).length;
  }

  private calculateReadingTime(wordCount: number): number {
    // 假设平均阅读速度为每分钟200字
    return Math.ceil(wordCount / 200);
  }

  private generateSlug(title: string, filePath: string): string {
    // 如果标题存在，从标题生成slug
    if (title) {
      return title
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
    }
    
    // 否则从文件名生成
    const fileName = path.basename(filePath, path.extname(filePath));
    return fileName
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  }
}