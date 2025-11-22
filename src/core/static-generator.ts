import { BlogConfig, Post, BuildResult, TemplateData } from '../types';
import { PostManager, DataProcessor, TemplateEngine } from '../core';
import { FileUtils, logger } from '../utils';
import { SearchIndexGenerator } from '../plugins/search';
import path from 'path';

export class StaticGenerator {
  private config: BlogConfig;
  private postManager: PostManager;
  private templateEngine: TemplateEngine;

  constructor(config: BlogConfig) {
    this.config = config;
    this.postManager = new PostManager(config);
    this.templateEngine = new TemplateEngine(config);
  }

  /**
   * 生成静态网站
   */
  async generate(): Promise<BuildResult> {
    logger.info('Starting static site generation...');
    
    try {
      // 1. 加载文章
      const posts = await this.loadPosts();
      
      // 2. 处理数据
      const { categories, tags, archives } = DataProcessor.processPosts(posts);
      
      // 3. 生成页面
      await this.generatePages(posts, categories, tags, archives);
      
      // 4. 复制静态资源
      await this.copyAssets();
      
      // 5. 生成RSS和站点地图
      const rss = await this.generateRSS(posts);
      const sitemap = await this.generateSitemap(posts, categories, tags, archives);
      
      logger.success('Static site generation completed!');
      
      return {
        posts,
        pages: this.getGeneratedPages(),
        categories,
        tags,
        archives,
        rss,
        sitemap,
      };
    } catch (error) {
      logger.error('Static site generation failed', error);
      throw error;
    }
  }

  /**
   * 加载文章
   */
  private async loadPosts(): Promise<Post[]> {
    logger.info('Loading posts...');
    
    const postsDir = path.resolve(process.cwd(), this.config.posts?.dir || 'posts');
    const posts = await this.postManager.loadPosts(postsDir);
    
    logger.success(`Loaded ${posts.length} posts`);
    return posts;
  }

  /**
   * 生成所有页面
   */
  private async generatePages(
    posts: Post[],
    categories: any[],
    tags: any[],
    archives: any[]
  ): Promise<void> {
    logger.info('Generating pages...');
    
    // 生成首页
    await this.generateHomePages(posts);
    
    // 生成文章页面
    await this.generatePostPages(posts);
    
    // 生成分类页面
    await this.generateCategoryPages(categories);
    
    // 生成标签页面
    await this.generateTagPages(tags);
    
    // 生成归档页面
    await this.generateArchivePages(archives);
    
    // 生成搜索页面
    await this.generateSearchPage();
    
    // 生成404页面
    await this.generate404Page();
    
    // 生成搜索索引
    await this.generateSearchIndex(posts);
    
    logger.success('Pages generated successfully');
  }

  /**
   * 生成首页
   */
  private async generateHomePages(posts: Post[]): Promise<void> {
    logger.info('Generating home pages...');
    
    const homePages = DataProcessor.generateHomePages(posts, this.config.posts.perPage);
    
    for (const pageData of homePages) {
      const templateData: TemplateData = {
        title: this.config.title,
        content: '',
        meta: {
          title: this.config.title,
          description: this.config.description,
          keywords: this.config.seo.keywords,
          author: this.config.author,
          url: this.config.url,
          image: this.config.seo.ogImage,
          type: 'website',
          siteName: this.config.title,
          twitterCard: this.config.seo.twitterCard,
        },
        theme: this.config.theme,
        config: this.config,
        posts: pageData.posts,
        pagination: {
          current: pageData.page,
          total: pageData.totalPages,
          hasNext: pageData.page < pageData.totalPages,
          hasPrev: pageData.page > 1,
          nextUrl: pageData.page < pageData.totalPages ? `/page/${pageData.page + 1}/` : undefined,
          prevUrl: pageData.page > 1 ? (pageData.page === 2 ? '/' : `/page/${pageData.page - 1}/`) : undefined,
        },
      };
      
      const html = this.templateEngine.render('index', templateData);
      
      const filePath = pageData.page === 1 
        ? path.join(this.config.build.outputDir, 'index.html')
        : path.join(this.config.build.outputDir, 'page', String(pageData.page), 'index.html');
      
      await FileUtils.writeFile(filePath, html);
      logger.debug(`Generated home page ${pageData.page}`);
    }
  }

  /**
   * 生成文章页面
   */
  private async generatePostPages(posts: Post[]): Promise<void> {
    logger.info('Generating post pages...');
    
    for (const post of posts) {
      const adjacentPosts = this.postManager.getAdjacentPosts(post);
      
      const templateData: TemplateData = {
        title: post.title,
        content: '',
        meta: {
          title: post.title,
          description: post.description || post.excerpt,
          keywords: post.tags,
          author: post.author || this.config.author,
          url: `${this.config.url}${post.url}`,
          image: post.coverImage || this.config.seo.ogImage,
          type: 'article',
          siteName: this.config.title,
          twitterCard: this.config.seo.twitterCard,
        },
        theme: this.config.theme,
        config: this.config,
        post,
        prevPost: adjacentPosts.prev,
        nextPost: adjacentPosts.next,
      };
      
      const html = this.templateEngine.render('post', templateData);
      const filePath = path.join(this.config.build.outputDir, 'posts', post.slug, 'index.html');
      
      await FileUtils.writeFile(filePath, html);
      logger.debug(`Generated post page: ${post.slug}`);
    }
  }

  /**
   * 生成分类页面
   */
  private async generateCategoryPages(categories: any[]): Promise<void> {
    logger.info('Generating category pages...');
    
    const categoryPages = DataProcessor.generateCategoryPages(categories, this.config.posts.perPage);
    
    for (const pageData of categoryPages) {
      const templateData: TemplateData = {
        title: `分类: ${pageData.category.name}`,
        content: '',
        meta: {
          title: `分类: ${pageData.category.name} - ${this.config.title}`,
          description: `${pageData.category.name} 分类下的文章`,
          keywords: [pageData.category.name],
          author: this.config.author,
          url: `${this.config.url}/categories/${pageData.category.slug}/`,
          image: this.config.seo.ogImage,
          type: 'website',
          siteName: this.config.title,
          twitterCard: this.config.seo.twitterCard,
        },
        theme: this.config.theme,
        config: this.config,
        category: pageData.category,
        posts: pageData.posts,
        pagination: {
          current: pageData.page,
          total: pageData.totalPages,
          hasNext: pageData.page < pageData.totalPages,
          hasPrev: pageData.page > 1,
          nextUrl: pageData.page < pageData.totalPages ? `/categories/${pageData.category.slug}/page/${pageData.page + 1}/` : undefined,
          prevUrl: pageData.page > 1 ? `/categories/${pageData.category.slug}/page/${pageData.page - 1}/` : undefined,
        },
      };
      
      const html = this.templateEngine.render('category', templateData);
      
      const filePath = pageData.page === 1
        ? path.join(this.config.build.outputDir, 'categories', pageData.category.slug, 'index.html')
        : path.join(this.config.build.outputDir, 'categories', pageData.category.slug, 'page', String(pageData.page), 'index.html');
      
      await FileUtils.writeFile(filePath, html);
      logger.debug(`Generated category page: ${pageData.category.slug} - page ${pageData.page}`);
    }
  }

  /**
   * 生成标签页面
   */
  private async generateTagPages(tags: any[]): Promise<void> {
    logger.info('Generating tag pages...');
    
    const tagPages = DataProcessor.generateTagPages(tags, this.config.posts.perPage);
    
    for (const pageData of tagPages) {
      const templateData: TemplateData = {
        title: `标签: ${pageData.tag.name}`,
        content: '',
        meta: {
          title: `标签: ${pageData.tag.name} - ${this.config.title}`,
          description: `${pageData.tag.name} 标签下的文章`,
          keywords: [pageData.tag.name],
          author: this.config.author,
          url: `${this.config.url}/tags/${pageData.tag.slug}/`,
          image: this.config.seo.ogImage,
          type: 'website',
          siteName: this.config.title,
          twitterCard: this.config.seo.twitterCard,
        },
        theme: this.config.theme,
        config: this.config,
        tag: pageData.tag,
        posts: pageData.posts,
        pagination: {
          current: pageData.page,
          total: pageData.totalPages,
          hasNext: pageData.page < pageData.totalPages,
          hasPrev: pageData.page > 1,
          nextUrl: pageData.page < pageData.totalPages ? `/tags/${pageData.tag.slug}/page/${pageData.page + 1}/` : undefined,
          prevUrl: pageData.page > 1 ? `/tags/${pageData.tag.slug}/page/${pageData.page - 1}/` : undefined,
        },
      };
      
      const html = this.templateEngine.render('tag', templateData);
      
      const filePath = pageData.page === 1
        ? path.join(this.config.build.outputDir, 'tags', pageData.tag.slug, 'index.html')
        : path.join(this.config.build.outputDir, 'tags', pageData.tag.slug, 'page', String(pageData.page), 'index.html');
      
      await FileUtils.writeFile(filePath, html);
      logger.debug(`Generated tag page: ${pageData.tag.slug} - page ${pageData.page}`);
    }
  }

  /**
   * 生成归档页面
   */
  private async generateArchivePages(archives: any[]): Promise<void> {
    logger.info('Generating archive pages...');
    
    const archivePages = DataProcessor.generateArchivePages(archives, this.config.posts.perPage);
    
    for (const pageData of archivePages) {
      const templateData: TemplateData = {
        title: `归档: ${pageData.archive.year}年${pageData.archive.month}月`,
        content: '',
        meta: {
          title: `归档: ${pageData.archive.year}年${pageData.archive.month}月 - ${this.config.title}`,
          description: `${pageData.archive.year}年${pageData.archive.month}月的文章归档`,
          keywords: ['归档'],
          author: this.config.author,
          url: `${this.config.url}/archives/${pageData.archive.year}/${pageData.archive.month}/`,
          image: this.config.seo.ogImage,
          type: 'website',
          siteName: this.config.title,
          twitterCard: this.config.seo.twitterCard,
        },
        theme: this.config.theme,
        config: this.config,
        archive: pageData.archive,
        posts: pageData.posts,
        pagination: {
          current: pageData.page,
          total: pageData.totalPages,
          hasNext: pageData.page < pageData.totalPages,
          hasPrev: pageData.page > 1,
          nextUrl: pageData.page < pageData.totalPages ? `/archives/${pageData.archive.year}/${pageData.archive.month}/page/${pageData.page + 1}/` : undefined,
          prevUrl: pageData.page > 1 ? `/archives/${pageData.archive.year}/${pageData.archive.month}/page/${pageData.page - 1}/` : undefined,
        },
      };
      
      const html = this.templateEngine.render('archive', templateData);
      
      const filePath = pageData.page === 1
        ? path.join(this.config.build.outputDir, 'archives', String(pageData.archive.year), String(pageData.archive.month), 'index.html')
        : path.join(this.config.build.outputDir, 'archives', String(pageData.archive.year), String(pageData.archive.month), 'page', String(pageData.page), 'index.html');
      
      await FileUtils.writeFile(filePath, html);
      logger.debug(`Generated archive page: ${pageData.archive.year}-${pageData.archive.month} - page ${pageData.page}`);
    }
  }

  /**
   * 生成搜索页面
   */
  private async generateSearchPage(): Promise<void> {
    logger.info('Generating search page...');
    
    const templateData: TemplateData = {
      title: '搜索',
      content: '',
      meta: {
        title: `搜索 - ${this.config.title}`,
        description: '搜索博客文章',
        keywords: ['搜索'],
        author: this.config.author,
        url: `${this.config.url}/search/`,
        image: this.config.seo.ogImage,
        type: 'website',
        siteName: this.config.title,
        twitterCard: this.config.seo.twitterCard,
      },
      theme: this.config.theme,
      config: this.config,
    };
    
    const html = this.templateEngine.render('search', templateData);
    const filePath = path.join(this.config.build.outputDir, 'search', 'index.html');
    
    await FileUtils.writeFile(filePath, html);
    logger.debug('Generated search page');
  }

  /**
   * 生成404页面
   */
  private async generate404Page(): Promise<void> {
    logger.info('Generating 404 page...');
    
    const templateData: TemplateData = {
      title: '页面未找到',
      content: '',
      meta: {
        title: `404 - 页面未找到 - ${this.config.title}`,
        description: '页面未找到',
        keywords: ['404', '页面未找到'],
        author: this.config.author,
        url: `${this.config.url}/404.html`,
        image: this.config.seo.ogImage,
        type: 'website',
        siteName: this.config.title,
        twitterCard: this.config.seo.twitterCard,
      },
      theme: this.config.theme,
      config: this.config,
    };
    
    const html = this.templateEngine.render('404', templateData);
    const filePath = path.join(this.config.build.outputDir, '404.html');
    
    await FileUtils.writeFile(filePath, html);
    logger.debug('Generated 404 page');
  }

  /**
   * 复制静态资源
   */
  private async copyAssets(): Promise<void> {
    logger.info('Copying static assets...');
    
    const publicDir = path.resolve(process.cwd(), 'public');
    const assetsDir = path.resolve(process.cwd(), 'src/assets');
    const outputAssetsDir = path.join(this.config.build.outputDir, 'assets');
    
    // 复制public目录
    if (await FileUtils.exists(publicDir)) {
      await FileUtils.copy(publicDir, this.config.build.outputDir);
      logger.debug('Copied public assets');
    }
    
    // 复制src/assets目录
    if (await FileUtils.exists(assetsDir)) {
      await FileUtils.copy(assetsDir, outputAssetsDir);
      logger.debug('Copied source assets');
    }
    
    // 生成CSS和JS文件
    await this.generateAssets();
    
    logger.success('Assets copied successfully');
  }

  /**
   * 生成资源文件
   */
  private async generateAssets(): Promise<void> {
    const outputAssetsDir = path.join(this.config.build.outputDir, 'assets');
    
    // 生成CSS文件
    await this.generateCSS(outputAssetsDir);
    
    // 生成JavaScript文件
    await this.generateJS(outputAssetsDir);
    
    // 生成CNAME文件（如果配置了自定义域名）
    await this.generateCNAME();
  }

  /**
   * 生成CSS文件
   */
  private async generateCSS(outputDir: string): Promise<void> {
    const cssDir = path.join(outputDir, 'css');
    await FileUtils.ensureDir(cssDir);
    
    // 主样式文件
    const mainCSS = this.generateMainCSS();
    await FileUtils.writeFile(path.join(cssDir, 'main.css'), mainCSS);
    
    // Prism.js样式文件
    const prismCSS = this.generatePrismCSS();
    await FileUtils.writeFile(path.join(cssDir, 'prism.css'), prismCSS);
    
    logger.debug('Generated CSS files');
  }

  /**
   * 生成主CSS
   */
  private generateMainCSS(): string {
    return `
/* Main styles */
:root {
  --primary: ${this.config.theme.primary};
  --secondary: ${this.config.theme.secondary};
  --accent: ${this.config.theme.accent};
  --background: ${this.config.theme.background};
  --surface: ${this.config.theme.surface};
  --text: ${this.config.theme.text};
  --text-secondary: ${this.config.theme.textSecondary};
}

.dark {
  --primary: ${this.config.darkTheme.primary};
  --secondary: ${this.config.darkTheme.secondary};
  --accent: ${this.config.darkTheme.accent};
  --background: ${this.config.darkTheme.background};
  --surface: ${this.config.darkTheme.surface};
  --text: ${this.config.darkTheme.text};
  --text-secondary: ${this.config.darkTheme.textSecondary};
}

/* Custom blocks */
.custom-block {
  margin: 1rem 0;
  padding: 1rem;
  border-radius: 0.5rem;
}

.custom-block.tip {
  background-color: #f0f9ff;
  border-left: 4px solid #0ea5e9;
}

.dark .custom-block.tip {
  background-color: #0c4a6e;
}

.custom-block.warning {
  background-color: #fffbeb;
  border-left: 4px solid #f59e0b;
}

.dark .custom-block.warning {
  background-color: #78350f;
}

.custom-block.danger {
  background-color: #fef2f2;
  border-left: 4px solid #ef4444;
}

.dark .custom-block.danger {
  background-color: #7f1d1d;
}

.custom-block-title {
  font-weight: 600;
  margin-bottom: 0.5rem;
}

/* Header anchors */
.header-anchor {
  float: left;
  margin-left: -1.5rem;
  padding-right: 0.5rem;
  color: #9ca3af;
  text-decoration: none;
  opacity: 0;
  transition: opacity 0.2s;
}

.header-anchor:hover {
  opacity: 1;
}

h1:hover .header-anchor,
h2:hover .header-anchor,
h3:hover .header-anchor,
h4:hover .header-anchor,
h5:hover .header-anchor,
h6:hover .header-anchor {
  opacity: 1;
}

/* Table of contents */
.table-of-contents {
  background-color: var(--surface);
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  padding: 1rem;
  margin: 1rem 0;
}

.dark .table-of-contents {
  border-color: #374151;
}

.table-of-contents ul {
  list-style: none;
  padding-left: 0;
  margin: 0;
}

.table-of-contents li {
  margin: 0.25rem 0;
}

.table-of-contents a {
  color: var(--text-secondary);
  text-decoration: none;
  transition: color 0.2s;
}

.table-of-contents a:hover {
  color: var(--primary);
}

/* Search functionality */
#search-results {
  min-height: 200px;
}

.search-result {
  padding: 1rem;
  border-bottom: 1px solid #e5e7eb;
  transition: background-color 0.2s;
}

.dark .search-result {
  border-color: #374151;
}

.search-result:hover {
  background-color: var(--surface);
}

.search-result:last-child {
  border-bottom: none;
}

.search-result-title {
  font-size: 1.125rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.search-result-excerpt {
  color: var(--text-secondary);
  margin-bottom: 0.5rem;
}

.search-result-meta {
  font-size: 0.875rem;
  color: var(--text-secondary);
}

/* Comments */
.comments-container {
  min-height: 200px;
}

/* Mobile menu */
#mobile-menu {
  transition: all 0.3s ease-in-out;
}

#mobile-menu:not(.hidden) {
  animation: slideDown 0.3s ease-in-out;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Responsive images */
img {
  max-width: 100%;
  height: auto;
}

/* Code blocks */
pre {
  overflow-x: auto;
  font-size: 0.875rem;
  line-height: 1.5;
}

pre code {
  background: none;
  padding: 0;
}

/* Inline code */
:not(pre) > code {
  background-color: var(--surface);
  padding: 0.125rem 0.25rem;
  border-radius: 0.25rem;
  font-size: 0.875em;
}

/* Task lists */
.task-list-item {
  list-style: none;
}

.task-list-item-checkbox {
  margin-right: 0.5rem;
}

/* Print styles */
@media print {
  .header-anchor,
  #theme-toggle,
  #mobile-menu-toggle,
  #mobile-menu,
  .comments-container {
    display: none !important;
  }
  
  body {
    background: white !important;
    color: black !important;
  }
}
`;
  }

  /**
   * 生成Prism.js CSS
   */
  private generatePrismCSS(): string {
    return `
/* Prism.js theme */
code[class*="language-"],
pre[class*="language-"] {
  color: #f8f8f2;
  background: none;
  text-shadow: 0 1px rgba(0, 0, 0, 0.3);
  font-family: Consolas, Monaco, 'Andale Mono', 'Ubuntu Mono', monospace;
  font-size: 1em;
  text-align: left;
  white-space: pre;
  word-spacing: normal;
  word-break: normal;
  word-wrap: normal;
  line-height: 1.5;
  -moz-tab-size: 4;
  -o-tab-size: 4;
  tab-size: 4;
  -webkit-hyphens: none;
  -moz-hyphens: none;
  -ms-hyphens: none;
  hyphens: none;
}

/* Code blocks */
pre[class*="language-"] {
  padding: 1em;
  margin: .5em 0;
  overflow: auto;
  border-radius: 0.3em;
}

:not(pre) > code[class*="language-"],
pre[class*="language-"] {
  background: #272822;
}

/* Inline code */
:not(pre) > code[class*="language-"] {
  padding: .1em;
  border-radius: .3em;
  white-space: normal;
}

.token.comment,
.token.prolog,
.token.doctype,
.token.cdata {
  color: #8292a2;
}

.token.punctuation {
  color: #f8f8f2;
}

.token.namespace {
  opacity: .7;
}

.token.property,
.token.tag,
.token.constant,
.token.symbol,
.token.deleted {
  color: #f92672;
}

.token.boolean,
.token.number {
  color: #ae81ff;
}

.token.selector,
.token.attr-name,
.token.string,
.token.char,
.token.builtin,
.token.inserted {
  color: #a6e22e;
}

.token.operator,
.token.entity,
.token.url,
.language-css .token.string,
.style .token.string,
.token.variable {
  color: #f8f8f2;
}

.token.atrule,
.token.attr-value,
.token.function,
.token.class-name {
  color: #e6db74;
}

.token.keyword {
  color: #66d9ef;
}

.token.regex,
.token.important {
  color: #fd971f;
}

.token.important,
.token.bold {
  font-weight: bold;
}
.token.italic {
  font-style: italic;
}

.token.entity {
  cursor: help;
}
`;
  }

  /**
   * 生成JavaScript文件
   */
  private async generateJS(outputDir: string): Promise<void> {
    const jsDir = path.join(outputDir, 'js');
    await FileUtils.ensureDir(jsDir);
    
    // 主JavaScript文件
    const mainJS = this.generateMainJS();
    await FileUtils.writeFile(path.join(jsDir, 'main.js'), mainJS);
    
    // Prism.js文件
    const prismJS = this.generatePrismJS();
    await FileUtils.writeFile(path.join(jsDir, 'prism.js'), prismJS);
    
    // 搜索功能
    const searchJS = this.generateSearchJS();
    await FileUtils.writeFile(path.join(jsDir, 'search.js'), searchJS);
    
    logger.debug('Generated JavaScript files');
  }

  /**
   * 生成主JavaScript
   */
  private generateMainJS(): string {
    return `
// Theme toggle
document.addEventListener('DOMContentLoaded', function() {
  const themeToggle = document.getElementById('theme-toggle');
  const html = document.documentElement;
  
  // Check for saved theme preference or default to 'light' mode
  const currentTheme = localStorage.getItem('theme') || 'light';
  
  // Apply the saved theme
  if (currentTheme === 'dark') {
    html.classList.add('dark');
  } else {
    html.classList.remove('dark');
  }
  
  // Theme toggle functionality
  if (themeToggle) {
    themeToggle.addEventListener('click', function() {
      if (html.classList.contains('dark')) {
        html.classList.remove('dark');
        localStorage.setItem('theme', 'light');
      } else {
        html.classList.add('dark');
        localStorage.setItem('theme', 'dark');
      }
    });
  }
  
  // Mobile menu toggle
  const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
  const mobileMenu = document.getElementById('mobile-menu');
  
  if (mobileMenuToggle && mobileMenu) {
    mobileMenuToggle.addEventListener('click', function() {
      mobileMenu.classList.toggle('hidden');
    });
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', function(event) {
      if (!mobileMenu.contains(event.target) && !mobileMenuToggle.contains(event.target)) {
        mobileMenu.classList.add('hidden');
      }
    });
  }
  
  // Smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
  
  // Copy code functionality
  document.querySelectorAll('pre code').forEach(codeBlock => {
    const button = document.createElement('button');
    button.className = 'copy-code-btn';
    button.textContent = '复制';
    button.addEventListener('click', () => {
      navigator.clipboard.writeText(codeBlock.textContent).then(() => {
        button.textContent = '已复制!';
        setTimeout(() => {
          button.textContent = '复制';
        }, 2000);
      });
    });
    
    const pre = codeBlock.parentElement;
    pre.style.position = 'relative';
    pre.appendChild(button);
  });
  
  // Add copy button styles
  const style = document.createElement('style');
  style.textContent = \`
    .copy-code-btn {
      position: absolute;
      top: 8px;
      right: 8px;
      background: rgba(0, 0, 0, 0.7);
      color: white;
      border: none;
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 12px;
      cursor: pointer;
      opacity: 0;
      transition: opacity 0.2s;
    }
    
    pre:hover .copy-code-btn {
      opacity: 1;
    }
    
    .copy-code-btn:hover {
      background: rgba(0, 0, 0, 0.9);
    }
  \`;
  document.head.appendChild(style);
});
`;
  }

  /**
   * 生成Prism.js
   */
  private generatePrismJS(): string {
    return `
// Prism.js core components
var _self = (typeof window !== 'undefined') ? window : (typeof WorkerGlobalScope !== 'undefined' && self instanceof WorkerGlobalScope) ? self : {};
var Prism = (function(){
  var lang = /\\blang(?:uage)?-([\\w-]+)\\b/i;
  var uniqueId = 0;
  var _ = {
    manual: _self.Prism && _self.Prism.manual,
    disableWorkerMessageHandler: _self.Prism && _self.Prism.disableWorkerMessageHandler,
    util: {
      encode: function(tokens) {
        if (tokens instanceof Token) {
          return new Token(tokens.type, _.util.encode(tokens.content), tokens.alias);
        } else if (_.util.type(tokens) === 'Array') {
          return tokens.map(_.util.encode);
        } else {
          return tokens.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/\\u00a0/g, ' ');
        }
      },
      type: function(o) {
        return Object.prototype.toString.call(o).match(/\\[object (\\w+)\\]/)[1];
      },
      objId: function(obj) {
        if (!obj['__id']) {
          Object.defineProperty(obj, '__id', { value: ++uniqueId });
        }
        return obj['__id'];
      },
      clone: function(o, visited) {
        var type = _.util.type(o);
        visited = visited || {};
        switch (type) {
          case 'Object':
            if (visited[_.util.objId(o)]) {
              return visited[_.util.objId(o)];
            }
            var clone = {};
            visited[_.util.objId(o)] = clone;
            for (var key in o) {
              if (o.hasOwnProperty(key)) {
                clone[key] = _.util.clone(o[key], visited);
              }
            }
            return clone;
          case 'Array':
            if (visited[_.util.objId(o)]) {
              return visited[_.util.objId(o)];
            }
            var clone = [];
            visited[_.util.objId(o)] = clone;
            o.forEach(function (v, i) {
              clone[i] = _.util.clone(v, visited);
            });
            return clone;
        }
        return o;
      }
    },
    languages: {
      extend: function(id, redef) {
        var lang = _.util.clone(_.languages[id]);
        for (var key in redef) {
          lang[key] = redef[key];
        }
        return lang;
      },
      insertBefore: function(inside, before, insert, root) {
        root = root || _.languages;
        var grammar = root[inside];
        var ret = {};
        for (var token in grammar) {
          if (grammar.hasOwnProperty(token)) {
            if (token == before) {
              for (var newToken in insert) {
                if (insert.hasOwnProperty(newToken)) {
                  ret[newToken] = insert[newToken];
                }
              }
            }
            ret[token] = grammar[token];
          }
        }
        return root[inside] = ret;
      },
      DFS: function DFS(o, callback, type, visited) {
        visited = visited || {};
        for (var i in o) {
          if (o.hasOwnProperty(i)) {
            callback.call(o, i, o[i], type || i);
            if (_.util.type(o[i]) === 'Object' && !visited[_.util.objId(o[i])]) {
              visited[_.util.objId(o[i])] = true;
              DFS(o[i], callback, null, visited);
            } else if (_.util.type(o[i]) === 'Array' && !visited[_.util.objId(o[i])]) {
              visited[_.util.objId(o[i])] = true;
              DFS(o[i], callback, i, visited);
            }
          }
        }
      }
    },
    plugins: {},
    highlight: function(text, grammar, language) {
      var env = {
        code: text,
        grammar: grammar,
        language: language
      };
      _.hooks.run('before-tokenize', env);
      env.tokens = _.tokenize(env.code, env.grammar);
      _.hooks.run('after-tokenize', env);
      return Token.stringify(_.util.encode(env.tokens), env.language);
    },
    matchGrammar: function(text, strarr, grammar, index, startPos, oneshot, target) {
      for (var token in grammar) {
        if (!grammar.hasOwnProperty(token) || !grammar[token]) {
          continue;
        }
        var patterns = grammar[token];
        patterns = (_.util.type(patterns) === "Array") ? patterns : [patterns];
        for (var j = 0; j < patterns.length; ++j) {
          if (target && target == token) {
            return;
          }
          var pattern = patterns[j],
            inside = pattern.inside,
            lookbehind = !!pattern.lookbehind,
            greedy = !!pattern.greedy,
            lookbehindLength = 0,
            alias = pattern.alias;
          if (greedy && !pattern.pattern.global) {
            var flags = pattern.pattern.toString().match(/[imsuy]*$/)[0];
            pattern.pattern = RegExp(pattern.pattern.source, flags + "g");
          }
          pattern = pattern.pattern || pattern;
          for (var i = index, pos = startPos; i < strarr.length; pos += strarr[i].length, ++i) {
            var str = strarr[i];
            if (strarr.length > text.length) {
              return;
            }
            if (str instanceof Token) {
              continue;
            }
            if (greedy && i != strarr.length - 1) {
              pattern.lastIndex = pos;
              var match = pattern.exec(text);
              if (!match) {
                break;
              }
              var from = match.index + (lookbehind ? match[1].length : 0),
                to = match.index + match[0].length,
                k = i,
                p = pos;
              for (var len = strarr.length; k < len && (p < to || (!strarr[k].type && !strarr[k - 1].greedy)); ++k) {
                p += strarr[k].length;
                if (from >= p) {
                  ++i;
                  pos = p;
                }
              }
              if (strarr[i] instanceof Token) {
                continue;
              }
              delNum = k - i;
              str = text.slice(pos, p);
              match.index -= pos;
            } else {
              pattern.lastIndex = 0;
              var match = pattern.exec(str),
                delNum = 1;
            }
            if (!match) {
              if (oneshot) {
                break;
              }
              continue;
            }
            if(lookbehind) {
              lookbehindLength = match[1] ? match[1].length : 0;
            }
            var from = match.index + lookbehindLength,
              match = match[0].slice(lookbehindLength),
              to = from + match.length,
              before = str.slice(0, from),
              after = str.slice(to);
            var args = [i, delNum];
            if (before) {
              ++i;
              pos += before.length;
              args.push(before);
            }
            var wrapped = new Token(token, inside? _.tokenize(match, inside) : match, alias, match, greedy);
            args.push(wrapped);
            if (after) {
              args.push(after);
            }
            Array.prototype.splice.apply(strarr, args);
            if (delNum != 1) {
              _.matchGrammar(text, strarr, grammar, i, pos, true, token);
            }
            if (oneshot) {
              break;
            }
          }
        }
      }
    },
    tokenize: function(text, grammar, language) {
      var strarr = [text];
      var rest = grammar.rest;
      if (rest) {
        for (var token in rest) {
          grammar[token] = rest[token];
        }
        delete grammar.rest;
      }
      _.matchGrammar(text, strarr, grammar, 0, 0, false);
      return strarr;
    },
    hooks: {
      all: {},
      add: function(name, callback) {
        var hooks = _.hooks.all;
        hooks[name] = hooks[name] || [];
        hooks[name].push(callback);
      },
      run: function(name, env) {
        var callbacks = _.hooks.all[name];
        if (!callbacks || !callbacks.length) {
          return;
        }
        for (var i=0, callback; callback = callbacks[i++];) {
          callback(env);
        }
      }
    }
  };
  var Token = _.Token = function(type, content, alias, matchedStr, greedy) {
    this.type = type;
    this.content = content;
    this.alias = alias;
    this.length = 0 | (matchedStr || "").length;
    this.greedy = !!greedy;
  };
  Token.stringify = function(o, language, parent) {
    if (_.util.type(o) == 'Array') {
      return o.map(function(element) {
        return Token.stringify(element, language, o);
      }).join('');
    } else {
      var env = {
        type: o.type,
        content: Token.stringify(o.content, language, parent),
        tag: 'span',
        classes: ['token', o.type],
        attributes: {},
        language: language,
        parent: parent
      };
      if (o.alias) {
        var aliases = _.util.type(o.alias) === 'Array' ? o.alias : [o.alias];
        Array.prototype.push.apply(env.classes, aliases);
      }
      _.hooks.run('wrap', env);
      var attributes = Object.keys(env.attributes).map(function(name) {
        return name + '="' + (env.attributes[name] || '').replace(/"/g, '&quot;') + '"';
      }).join(' ');
      if (env.tag == 'span' && !attributes) {
        return env.content;
      } else {
        return '<' + env.tag + (attributes ? ' ' + attributes : '') + '>' + env.content + '</' + env.tag + '>';
      }
    }
  };
  if (!_self.document) {
    if (!_self.addEventListener) {
      return _self.Prism;
    }
    if (!_.disableWorkerMessageHandler) {
      _self.addEventListener('message', function(evt) {
        var message = JSON.parse(evt.data),
          lang = message.language,
          code = message.code,
          immediateClose = message.immediateClose;
        _self.postMessage(_.highlight(code, _.languages[lang], lang));
        if (immediateClose) {
          _self.close();
        }
      }, false);
    }
    return _self.Prism;
  }
  var script = document.currentScript || [].slice.call(document.getElementsByTagName("script")).pop();
  if (script) {
    _.filename = script.src;
    if (!_.manual && !script.hasAttribute('data-manual')) {
      if(document.readyState !== "loading") {
        if (window.requestAnimationFrame) {
          window.requestAnimationFrame(_.highlightAll);
        } else {
          window.setTimeout(_.highlightAll, 16);
        }
      }
      else {
        document.addEventListener('DOMContentLoaded', _.highlightAll);
      }
    }
  }
  return _self.Prism;
})();

if (typeof module !== 'undefined' && module.exports) {
  module.exports = Prism;
}

if (typeof global !== 'undefined') {
  global.Prism = Prism;
}
`;
  }

  /**
   * 生成搜索JavaScript
   */
  private generateSearchJS(): string {
    return `
// Search functionality
document.addEventListener('DOMContentLoaded', function() {
  const searchInput = document.getElementById('search-input');
  const searchResults = document.getElementById('search-results');
  const noResults = document.getElementById('no-results');
  
  if (!searchInput || !searchResults) return;
  
  let searchTimeout;
  let posts = [];
  
  // Load search index
  fetch('/search-index.json')
    .then(response => response.json())
    .then(data => {
      posts = data;
    })
    .catch(error => {
      console.error('Failed to load search index:', error);
    });
  
  // Search function
  function search(query) {
    if (!query.trim()) {
      searchResults.innerHTML = '';
      noResults.classList.add('hidden');
      return;
    }
    
    const results = posts.filter(post => {
      const searchTerm = query.toLowerCase();
      return (
        post.title.toLowerCase().includes(searchTerm) ||
        post.content.toLowerCase().includes(searchTerm) ||
        post.tags.some(tag => tag.toLowerCase().includes(searchTerm)) ||
        (post.category && post.category.toLowerCase().includes(searchTerm)) ||
        (post.description && post.description.toLowerCase().includes(searchTerm))
      );
    }).slice(0, 10);
    
    displayResults(results, query);
  }
  
  // Display search results
  function displayResults(results, query) {
    if (results.length === 0) {
      searchResults.innerHTML = '';
      noResults.classList.remove('hidden');
      return;
    }
    
    noResults.classList.add('hidden');
    
    const html = results.map(post => {
      const excerpt = highlightText(post.excerpt || '', query);
      const title = highlightText(post.title, query);
      
      return \`
        <div class="search-result">
          <div class="search-result-title">
            <a href="\${post.url}" class="text-primary hover:underline">
              \${title}
            </a>
          </div>
          <div class="search-result-excerpt">
            \${excerpt}
          </div>
          <div class="search-result-meta">
            <time>\${post.date}</time>
            \${post.readingTime ? \` • \${post.readingTime} 分钟阅读\` : ''}
            \${post.category ? \` • <span>\${post.category}</span>\` : ''}
          </div>
        </div>
      \`;
    }).join('');
    
    searchResults.innerHTML = html;
  }
  
  // Highlight search terms
  function highlightText(text, query) {
    const regex = new RegExp('(' + query + ')', 'gi');
    return text.replace(regex, '<mark class="bg-yellow-200 dark:bg-yellow-800">$1</mark>');
  }
  
  // Search input event
  searchInput.addEventListener('input', function(e) {
    clearTimeout(searchTimeout);
    const query = e.target.value;
    
    searchTimeout = setTimeout(() => {
      search(query);
    }, 300);
  });
  
  // Initial search if query exists
  const urlParams = new URLSearchParams(window.location.search);
  const query = urlParams.get('q');
  if (query) {
    searchInput.value = query;
    search(query);
  }
});
`;
  }

  /**
   * 生成CNAME文件
   */
  private async generateCNAME(): Promise<void> {
    if (this.config.url && !this.config.url.includes('github.io')) {
      const cnameContent = this.config.url.replace(/^https?:\/\//, '').replace(/\/$/, '');
      const cnamePath = path.join(this.config.build.outputDir, 'CNAME');
      await FileUtils.writeFile(cnamePath, cnameContent);
      logger.debug('Generated CNAME file');
    }
  }

  /**
   * 生成RSS订阅
   */
  private async generateRSS(posts: Post[]): Promise<string> {
    if (!this.config.plugins.rss.enabled) {
      return '';
    }
    
    logger.info('Generating RSS feed...');
    
    const { Feed } = await import('feed');
    
    const feed = new Feed({
      title: this.config.plugins.rss.title,
      description: this.config.plugins.rss.description,
      id: this.config.url,
      link: this.config.url,
      language: this.config.plugins.rss.language,
      image: `${this.config.url}/assets/og-image.png`,
      favicon: `${this.config.url}/assets/favicon.ico`,
      copyright: `© ${new Date().getFullYear()} ${this.config.author}`,
      updated: posts.length > 0 ? posts[0].date : new Date(),
      generator: 'Markdown Blog',
      feedLinks: {
        rss: `${this.config.url}/rss.xml`,
      },
      author: {
        name: this.config.author,
        email: this.config.social.email,
        link: this.config.url,
      },
    });
    
    // 添加文章到RSS
    posts.slice(0, 20).forEach(post => {
      feed.addItem({
        title: post.title,
        id: `${this.config.url}${post.url}`,
        link: `${this.config.url}${post.url}`,
        description: post.description || post.excerpt,
        content: post.content,
        author: [
          {
            name: post.author || this.config.author,
            email: this.config.social.email,
          },
        ],
        date: post.date,
        category: post.tags.map(tag => ({ name: tag })),
      });
    });
    
    const rssContent = feed.rss2();
    const rssPath = path.join(this.config.build.outputDir, 'rss.xml');
    await FileUtils.writeFile(rssPath, rssContent);
    
    logger.success('RSS feed generated');
    return rssPath;
  }

  /**
   * 生成站点地图
   */
  private async generateSitemap(posts: Post[], categories: any[], tags: any[], archives: any[]): Promise<string> {
    if (!this.config.plugins.sitemap.enabled) {
      return '';
    }
    
    logger.info('Generating sitemap...');
    
    const { SitemapStream } = await import('sitemap');
    const { createWriteStream } = await import('fs');
    
    const sitemapPath = path.join(this.config.build.outputDir, 'sitemap.xml');
    const stream = new SitemapStream({ hostname: this.config.plugins.sitemap.hostname });
    const writeStream = createWriteStream(sitemapPath);
    
    stream.pipe(writeStream);
    
    // 添加首页
    stream.write({
      url: '/',
      changefreq: 'daily',
      priority: 1.0,
    });
    
    // 添加文章页面
    posts.forEach(post => {
      stream.write({
        url: post.url,
        lastmod: post.updated || post.date,
        changefreq: 'weekly',
        priority: 0.8,
      });
    });
    
    // 添加分类页面
    categories.forEach(category => {
      stream.write({
        url: `/categories/${category.slug}/`,
        changefreq: 'weekly',
        priority: 0.6,
      });
    });
    
    // 添加标签页面
    tags.forEach(tag => {
      stream.write({
        url: `/tags/${tag.slug}/`,
        changefreq: 'weekly',
        priority: 0.6,
      });
    });
    
    // 添加归档页面
    archives.forEach(archive => {
      stream.write({
        url: `/archives/${archive.year}/${archive.month}/`,
        changefreq: 'monthly',
        priority: 0.5,
      });
    });
    
    // 添加其他页面
    stream.write({
      url: '/search/',
      changefreq: 'monthly',
      priority: 0.4,
    });
    
    stream.end();
    
    await new Promise<void>((resolve, reject) => {
      writeStream.on('finish', resolve);
      writeStream.on('error', reject);
    });
    
    logger.success('Sitemap generated');
    return sitemapPath;
  }

  /**
   * 生成搜索索引
   */
  private async generateSearchIndex(posts: Post[]): Promise<void> {
    if (!this.config.search.enabled) {
      return;
    }
    
    logger.info('Generating search index...');
    await SearchIndexGenerator.generate(posts, this.config.build.outputDir);
    logger.success('Search index generated');
  }

  /**
   * 获取生成的页面列表
   */
  private getGeneratedPages(): string[] {
    // 这里可以实现更复杂的逻辑来跟踪生成的页面
    return [
      'index.html',
      '404.html',
      'rss.xml',
      'sitemap.xml',
    ];
  }
}