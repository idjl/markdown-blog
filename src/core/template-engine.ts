import { TemplateData, BlogConfig } from '../types';
import { FileUtils } from '../utils';
import { logger } from '../utils/logger';
import path from 'path';

export class TemplateEngine {
  private templates: Map<string, string> = new Map();
  private config: BlogConfig;

  constructor(config: BlogConfig) {
    this.config = config;
    this.loadTemplates();
  }

  /**
   * 加载模板文件
   */
  private async loadTemplates(): Promise<void> {
    const templatesDir = path.resolve(process.cwd(), this.config.build?.templatesDir || 'src/templates');
    
    logger.debug(`Looking for templates in: ${templatesDir}`);
    
    try {
      const pattern = path.join(templatesDir, '*.html');
      logger.debug(`Using glob pattern: ${pattern}`);
      
      const templateFiles = await FileUtils.glob(pattern);
      
      logger.debug(`Found ${templateFiles.length} template files:`, templateFiles);
      
      for (const file of templateFiles) {
        const templateName = path.basename(file, '.html');
        const content = await FileUtils.readFile(file);
        this.templates.set(templateName, content);
        logger.debug(`Loaded template: ${templateName}`);
      }
      
      logger.success(`Loaded ${templateFiles.length} templates`);
    } catch (error) {
      logger.error('Failed to load templates', error);
      // 使用默认模板
      this.loadDefaultTemplates();
    }
  }

  /**
   * 加载默认模板
   */
  private loadDefaultTemplates(): void {
    this.templates.set('layout', this.getDefaultLayoutTemplate());
    this.templates.set('index', this.getDefaultIndexTemplate());
    this.templates.set('post', this.getDefaultPostTemplate());
    this.templates.set('category', this.getDefaultCategoryTemplate());
    this.templates.set('tag', this.getDefaultTagTemplate());
    this.templates.set('archive', this.getDefaultArchiveTemplate());
    this.templates.set('search', this.getDefaultSearchTemplate());
    this.templates.set('404', this.getDefault404Template());
    
    logger.info('Loaded default templates');
  }

  /**
   * 渲染模板
   */
  render(templateName: string, data: TemplateData): string {
    const template = this.templates.get(templateName);
    if (!template) {
      throw new Error(`Template not found: ${templateName}`);
    }

    // 合并数据
    const fullData = {
      ...data,
      config: this.config,
      meta: data.meta || this.generateMetaData(data),
    };

    // 渲染模板
    let rendered = template;
    
    // 简单的模板替换
    rendered = this.replaceVariables(rendered, fullData);
    
    // 渲染子模板
    if (templateName !== 'layout') {
      rendered = this.renderLayout(rendered, fullData);
    }

    return rendered;
  }

  /**
   * 替换模板变量
   */
  private replaceVariables(template: string, data: any): string {
    // Handle if/else conditions
    template = this.processConditionals(template, data);
    
    // Handle simple variable replacements
    return template.replace(/\{\{([^}]+)\}\}/g, (match, key) => {
      const keys = key.trim().split('.');
      let value = data;
      
      for (const k of keys) {
        value = value?.[k];
      }
      
      return value !== undefined ? String(value) : match;
    });
  }

  /**
   * 处理条件语句
   */
  private processConditionals(template: string, data: any): string {
    // Handle {{#if condition}}...{{/if}}
    template = template.replace(/\{\{#if\s+([^}]+)\}\}(.*?)\{\{\/if\}\}/gs, (_match, condition, content) => {
      if (this.evaluateCondition(condition.trim(), data)) {
        return content;
      }
      return '';
    });

    // Handle {{#if (eq val1 val2)}}...{{/if}}
    template = template.replace(/\{\{#if\s+\(eq\s+([^)]+)\)\}\}(.*?)\{\{\/if\}\}/gs, (_match, args, content) => {
      const [val1, val2] = args.trim().split(/\s+/);
      const actualVal1 = this.getValue(val1, data);
      const actualVal2 = this.getValue(val2, data);
      if (actualVal1 === actualVal2) {
        return content;
      }
      return '';
    });

    return template;
  }

  /**
   * 评估条件
   */
  private evaluateCondition(condition: string, data: any): boolean {
    // Simple boolean evaluation
    const value = this.getValue(condition, data);
    return Boolean(value);
  }

  /**
   * 获取值
   */
  private getValue(key: string, data: any): any {
    if (key.startsWith('"') && key.endsWith('"')) {
      return key.slice(1, -1);
    }
    if (key.startsWith("'") && key.endsWith("'")) {
      return key.slice(1, -1);
    }
    
    const keys = key.split('.');
    let value = data;
    for (const k of keys) {
      value = value?.[k];
    }
    return value;
  }

  /**
   * 渲染布局模板
   */
  private renderLayout(content: string, data: TemplateData): string {
    const layoutTemplate = this.templates.get('layout');
    if (!layoutTemplate) {
      return content;
    }

    const layoutData = {
      ...data,
      content,
    };

    return this.replaceVariables(layoutTemplate, layoutData);
  }

  /**
   * 生成元数据
   */
  private generateMetaData(data: TemplateData): any {
    return {
      title: data.title ? `${data.title} - ${this.config.title}` : this.config.title,
      description: data.meta?.description || this.config.description,
      keywords: data.meta?.keywords || this.config.seo.keywords,
      author: data.meta?.author || this.config.author,
      url: data.meta?.url || this.config.url,
      image: data.meta?.image || this.config.seo.ogImage,
      type: data.meta?.type || 'website',
      siteName: this.config.title,
      twitterCard: this.config.seo.twitterCard,
    };
  }

  /**
   * 默认布局模板
   */
  private getDefaultLayoutTemplate(): string {
    return `<!DOCTYPE html>
<html lang="{{config.language}}" class="{{#if config.theme.darkMode}}dark{{/if}}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{{meta.title}}</title>
  <meta name="description" content="{{meta.description}}">
  <meta name="keywords" content="{{meta.keywords}}">
  <meta name="author" content="{{meta.author}}">
  
  <!-- Open Graph -->
  <meta property="og:title" content="{{meta.title}}">
  <meta property="og:description" content="{{meta.description}}">
  <meta property="og:type" content="{{meta.type}}">
  <meta property="og:url" content="{{meta.url}}">
  <meta property="og:image" content="{{meta.image}}">
  <meta property="og:site_name" content="{{meta.siteName}}">
  
  <!-- Twitter Card -->
  <meta name="twitter:card" content="{{meta.twitterCard}}">
  <meta name="twitter:title" content="{{meta.title}}">
  <meta name="twitter:description" content="{{meta.description}}">
  <meta name="twitter:image" content="{{meta.image}}">
  
  <!-- Theme -->
  <script>
    // Theme detection
    if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  </script>
  
  <!-- Styles -->
  <link rel="stylesheet" href="/assets/css/main.css">
  <link rel="stylesheet" href="/assets/css/prism.css">
  
  <!-- RSS -->
  <link rel="alternate" type="application/rss+xml" title="{{config.title}} RSS" href="/rss.xml">
  
  <!-- Favicon -->
  <link rel="icon" type="image/x-icon" href="/assets/favicon.ico">
</head>
<body class="bg-background text-text min-h-screen">
  <!-- Header -->
  <header class="border-b border-gray-200 dark:border-gray-800">
    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center py-6">
        <div class="flex items-center">
          <a href="/" class="text-2xl font-bold text-primary hover:text-primary/80 transition-colors">
            {{config.title}}
          </a>
        </div>
        
        <nav class="hidden md:flex space-x-8">
          <a href="/" class="text-gray-600 hover:text-primary dark:text-gray-300 dark:hover:text-primary transition-colors">
            首页
          </a>
          <a href="/categories/" class="text-gray-600 hover:text-primary dark:text-gray-300 dark:hover:text-primary transition-colors">
            分类
          </a>
          <a href="/tags/" class="text-gray-600 hover:text-primary dark:text-gray-300 dark:hover:text-primary transition-colors">
            标签
          </a>
          <a href="/archives/" class="text-gray-600 hover:text-primary dark:text-gray-300 dark:hover:text-primary transition-colors">
            归档
          </a>
          <a href="/search/" class="text-gray-600 hover:text-primary dark:text-gray-300 dark:hover:text-primary transition-colors">
            搜索
          </a>
        </nav>
        
        <div class="flex items-center space-x-4">
          <!-- Theme toggle -->
          <button id="theme-toggle" class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
            <span class="dark:hidden">🌙</span>
            <span class="hidden dark:inline">☀️</span>
          </button>
          
          <!-- Mobile menu -->
          <button id="mobile-menu-toggle" class="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
            <span class="block w-6 h-0.5 bg-gray-600 dark:bg-gray-300 mb-1"></span>
            <span class="block w-6 h-0.5 bg-gray-600 dark:bg-gray-300 mb-1"></span>
            <span class="block w-6 h-0.5 bg-gray-600 dark:bg-gray-300"></span>
          </button>
        </div>
      </div>
      
      <!-- Mobile navigation -->
      <nav id="mobile-menu" class="md:hidden pb-6 hidden">
        <div class="flex flex-col space-y-4">
          <a href="/" class="text-gray-600 hover:text-primary dark:text-gray-300 dark:hover:text-primary transition-colors">
            首页
          </a>
          <a href="/categories/" class="text-gray-600 hover:text-primary dark:text-gray-300 dark:hover:text-primary transition-colors">
            分类
          </a>
          <a href="/tags/" class="text-gray-600 hover:text-primary dark:text-gray-300 dark:hover:text-primary transition-colors">
            标签
          </a>
          <a href="/archives/" class="text-gray-600 hover:text-primary dark:text-gray-300 dark:hover:text-primary transition-colors">
            归档
          </a>
          <a href="/search/" class="text-gray-600 hover:text-primary dark:text-gray-300 dark:hover:text-primary transition-colors">
            搜索
          </a>
        </div>
      </nav>
    </div>
  </header>
  
  <!-- Main content -->
  <main class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    {{{content}}}
  </main>
  
  <!-- Footer -->
  <footer class="border-t border-gray-200 dark:border-gray-800 mt-16">
    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="flex flex-col md:flex-row justify-between items-center">
        <div class="text-gray-600 dark:text-gray-400 mb-4 md:mb-0">
          © {{currentYear}} {{config.author}}. Powered by 
          <a href="https://github.com/yourusername/markdown-blog" class="text-primary hover:underline">
            Markdown Blog
          </a>
        </div>
        
        <div class="flex space-x-6">
          {{#if config.social.github}}
          <a href="https://github.com/{{config.social.github}}" class="text-gray-600 hover:text-primary dark:text-gray-400 dark:hover:text-primary transition-colors">
            GitHub
          </a>
          {{/if}}
          {{#if config.social.twitter}}
          <a href="https://twitter.com/{{config.social.twitter}}" class="text-gray-600 hover:text-primary dark:text-gray-400 dark:hover:text-primary transition-colors">
            Twitter
          </a>
          {{/if}}
          {{#if config.social.email}}
          <a href="mailto:{{config.social.email}}" class="text-gray-600 hover:text-primary dark:text-gray-400 dark:hover:text-primary transition-colors">
            Email
          </a>
          {{/if}}
          {{#if config.social.rss}}
          <a href="/rss.xml" class="text-gray-600 hover:text-primary dark:text-gray-400 dark:hover:text-primary transition-colors">
            RSS
          </a>
          {{/if}}
        </div>
      </div>
    </div>
  </footer>
  
  <!-- Scripts -->
  <script src="/assets/js/main.js"></script>
  <script src="/assets/js/prism.js"></script>
</body>
</html>`;
  }

  /**
   * 默认首页模板
   */
  private getDefaultIndexTemplate(): string {
    return `<div class="space-y-8">
  <!-- Hero section -->
  <div class="text-center py-12">
    <h1 class="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-4">
      {{config.title}}
    </h1>
    <p class="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
      {{config.description}}
    </p>
  </div>
  
  <!-- Posts list -->
  <div class="space-y-6">
    {{#each posts}}
    <article class="bg-surface rounded-lg shadow-sm hover:shadow-md transition-shadow p-6">
      <div class="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
        <h2 class="text-2xl font-bold text-text dark:text-white mb-2 md:mb-0">
          <a href="{{url}}" class="hover:text-primary transition-colors">
            {{title}}
          </a>
        </h2>
        <time class="text-sm text-text-secondary dark:text-gray-400">
          {{date}}
        </time>
      </div>
      
      {{#if description}}
      <p class="text-text-secondary dark:text-gray-400 mb-4">
        {{description}}
      </p>
      {{else}}
      <p class="text-text-secondary dark:text-gray-400 mb-4">
        {{excerpt}}
      </p>
      {{/if}}
      
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-4 text-sm text-text-secondary dark:text-gray-400">
          {{#if readingTime}}
          <span>{{readingTime}} 分钟阅读</span>
          {{/if}}
          {{#if wordCount}}
          <span>{{wordCount}} 字</span>
          {{/if}}
        </div>
        
        <div class="flex items-center space-x-2">
          {{#if category}}
          <a href="/categories/{{category.slug}}/" class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary hover:bg-primary/20 transition-colors">
            {{category}}
          </a>
          {{/if}}
          
          {{#each tags}}
          <a href="/tags/{{slug}}/" class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
            {{this}}
          </a>
          {{/each}}
        </div>
      </div>
    </article>
    {{/each}}
  </div>
  
  <!-- Pagination -->
  {{#if pagination}}
  <nav class="flex justify-center items-center space-x-2">
    {{#if pagination.hasPrev}}
    <a href="{{pagination.prevUrl}}" class="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
      上一页
    </a>
    {{/if}}
    
    <span class="px-4 py-2 text-gray-600 dark:text-gray-400">
      第 {{pagination.current}} 页，共 {{pagination.total}} 页
    </span>
    
    {{#if pagination.hasNext}}
    <a href="{{pagination.nextUrl}}" class="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
      下一页
    </a>
    {{/if}}
  </nav>
  {{/if}}
</div>`;
  }

  /**
   * 默认文章页面模板
   */
  private getDefaultPostTemplate(): string {
    return `<article class="max-w-4xl mx-auto">
  <!-- Post header -->
  <header class="mb-8">
    <h1 class="text-4xl font-bold text-text dark:text-white mb-4">
      {{post.title}}
    </h1>
    
    <div class="flex flex-wrap items-center gap-4 text-sm text-text-secondary dark:text-gray-400">
      {{#if post.date}}
      <time datetime="{{post.date}}">
        {{post.date}}
      </time>
      {{/if}}
      
      {{#if post.author}}
      <span>
        作者: {{post.author}}
      </span>
      {{/if}}
      
      {{#if post.readingTime}}
      <span>
        {{post.readingTime}} 分钟阅读
      </span>
      {{/if}}
      
      {{#if post.wordCount}}
      <span>
        {{post.wordCount}} 字
      </span>
      {{/if}}
    </div>
    
    {{#if post.category}}
    <div class="mt-4">
      <a href="/categories/{{post.category.slug}}/" class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary/10 text-primary hover:bg-primary/20 transition-colors">
        {{post.category}}
      </a>
    </div>
    {{/if}}
    
    {{#if post.tags.length}}
    <div class="mt-4 flex flex-wrap gap-2">
      {{#each post.tags}}
      <a href="/tags/{{slug}}/" class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
        {{this}}
      </a>
      {{/each}}
    </div>
    {{/if}}
  </header>
  
  <!-- Post content -->
  <div class="prose prose-lg dark:prose-invert max-w-none">
    {{{post.content}}}
  </div>
  
  <!-- Post navigation -->
  <nav class="mt-12 flex justify-between items-center">
    {{#if prevPost}}
    <a href="{{prevPost.url}}" class="flex items-center text-primary hover:underline">
      <span class="mr-2">←</span>
      <div>
        <div class="text-sm text-text-secondary dark:text-gray-400">上一篇</div>
        <div class="font-medium">{{prevPost.title}}</div>
      </div>
    </a>
    {{/if}}
    
    {{#if nextPost}}
    <a href="{{nextPost.url}}" class="flex items-center text-primary hover:underline ml-auto">
      <div class="text-right">
        <div class="text-sm text-text-secondary dark:text-gray-400">下一篇</div>
        <div class="font-medium">{{nextPost.title}}</div>
      </div>
      <span class="ml-2">→</span>
    </a>
    {{/if}}
  </nav>
  
  <!-- Comments -->
  {{#if config.comments.enabled}}
  <div class="mt-12">
    <h3 class="text-2xl font-bold text-text dark:text-white mb-6">评论</h3>
    <div id="comments" class="comments-container">
      <!-- Comments will be loaded here -->
    </div>
  </div>
  {{/if}}
</article>`;
  }

  /**
   * 默认分类页面模板
   */
  private getDefaultCategoryTemplate(): string {
    return `<div class="space-y-8">
  <header class="text-center py-8">
    <h1 class="text-4xl font-bold text-text dark:text-white mb-4">
      分类: {{category.name}}
    </h1>
    <p class="text-lg text-text-secondary dark:text-gray-400">
      共 {{category.count}} 篇文章
    </p>
  </header>
  
  <!-- Posts list -->
  <div class="space-y-6">
    {{#each posts}}
    <article class="bg-surface rounded-lg shadow-sm hover:shadow-md transition-shadow p-6">
      <div class="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
        <h2 class="text-2xl font-bold text-text dark:text-white mb-2 md:mb-0">
          <a href="{{url}}" class="hover:text-primary transition-colors">
            {{title}}
          </a>
        </h2>
        <time class="text-sm text-text-secondary dark:text-gray-400">
          {{date}}
        </time>
      </div>
      
      {{#if description}}
      <p class="text-text-secondary dark:text-gray-400 mb-4">
        {{description}}
      </p>
      {{else}}
      <p class="text-text-secondary dark:text-gray-400 mb-4">
        {{excerpt}}
      </p>
      {{/if}}
      
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-4 text-sm text-text-secondary dark:text-gray-400">
          {{#if readingTime}}
          <span>{{readingTime}} 分钟阅读</span>
          {{/if}}
          {{#if wordCount}}
          <span>{{wordCount}} 字</span>
          {{/if}}
        </div>
        
        <div class="flex items-center space-x-2">
          {{#each tags}}
          <a href="/tags/{{slug}}/" class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
            {{this}}
          </a>
          {{/each}}
        </div>
      </div>
    </article>
    {{/each}}
  </div>
  
  <!-- Pagination -->
  {{#if pagination}}
  <nav class="flex justify-center items-center space-x-2">
    {{#if pagination.hasPrev}}
    <a href="{{pagination.prevUrl}}" class="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
      上一页
    </a>
    {{/if}}
    
    <span class="px-4 py-2 text-gray-600 dark:text-gray-400">
      第 {{pagination.current}} 页，共 {{pagination.total}} 页
    </span>
    
    {{#if pagination.hasNext}}
    <a href="{{pagination.nextUrl}}" class="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
      下一页
    </a>
    {{/if}}
  </nav>
  {{/if}}
</div>`;
  }

  /**
   * 默认标签页面模板
   */
  private getDefaultTagTemplate(): string {
    return `<div class="space-y-8">
  <header class="text-center py-8">
    <h1 class="text-4xl font-bold text-text dark:text-white mb-4">
      标签: {{tag.name}}
    </h1>
    <p class="text-lg text-text-secondary dark:text-gray-400">
      共 {{tag.count}} 篇文章
    </p>
  </header>
  
  <!-- Posts list -->
  <div class="space-y-6">
    {{#each posts}}
    <article class="bg-surface rounded-lg shadow-sm hover:shadow-md transition-shadow p-6">
      <div class="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
        <h2 class="text-2xl font-bold text-text dark:text-white mb-2 md:mb-0">
          <a href="{{url}}" class="hover:text-primary transition-colors">
            {{title}}
          </a>
        </h2>
        <time class="text-sm text-text-secondary dark:text-gray-400">
          {{date}}
        </time>
      </div>
      
      {{#if description}}
      <p class="text-text-secondary dark:text-gray-400 mb-4">
        {{description}}
      </p>
      {{else}}
      <p class="text-text-secondary dark:text-gray-400 mb-4">
        {{excerpt}}
      </p>
      {{/if}}
      
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-4 text-sm text-text-secondary dark:text-gray-400">
          {{#if readingTime}}
          <span>{{readingTime}} 分钟阅读</span>
          {{/if}}
          {{#if wordCount}}
          <span>{{wordCount}} 字</span>
          {{/if}}
        </div>
        
        <div class="flex items-center space-x-2">
          {{#if category}}
          <a href="/categories/{{category.slug}}/" class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary hover:bg-primary/20 transition-colors">
            {{category}}
          </a>
          {{/if}}
          
          {{#each tags}}
          <a href="/tags/{{slug}}/" class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
            {{this}}
          </a>
          {{/each}}
        </div>
      </div>
    </article>
    {{/each}}
  </div>
  
  <!-- Pagination -->
  {{#if pagination}}
  <nav class="flex justify-center items-center space-x-2">
    {{#if pagination.hasPrev}}
    <a href="{{pagination.prevUrl}}" class="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
      上一页
    </a>
    {{/if}}
    
    <span class="px-4 py-2 text-gray-600 dark:text-gray-400">
      第 {{pagination.current}} 页，共 {{pagination.total}} 页
    </span>
    
    {{#if pagination.hasNext}}
    <a href="{{pagination.nextUrl}}" class="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
      下一页
    </a>
    {{/if}}
  </nav>
  {{/if}}
</div>`;
  }

  /**
   * 默认归档页面模板
   */
  private getDefaultArchiveTemplate(): string {
    return `<div class="space-y-8">
  <header class="text-center py-8">
    <h1 class="text-4xl font-bold text-text dark:text-white mb-4">
      文章归档
    </h1>
    <p class="text-lg text-text-secondary dark:text-gray-400">
      共 {{totalPosts}} 篇文章
    </p>
  </header>
  
  <!-- Archives by year -->
  <div class="space-y-8">
    {{#each archives}}
    <div class="bg-surface rounded-lg shadow-sm p-6">
      <h2 class="text-2xl font-bold text-text dark:text-white mb-4">
        {{year}} 年 {{month}} 月
        <span class="text-sm text-text-secondary dark:text-gray-400 font-normal">
          ({{count}} 篇文章)
        </span>
      </h2>
      
      <div class="space-y-4">
        {{#each posts}}
        <article class="flex flex-col md:flex-row md:items-center md:justify-between p-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
          <div class="flex-1">
            <h3 class="text-lg font-medium text-text dark:text-white mb-1">
              <a href="{{url}}" class="hover:text-primary transition-colors">
                {{title}}
              </a>
            </h3>
            {{#if description}}
            <p class="text-sm text-text-secondary dark:text-gray-400">
              {{description}}
            </p>
            {{/if}}
          </div>
          
          <div class="mt-2 md:mt-0 md:ml-4 flex items-center space-x-4 text-sm text-text-secondary dark:text-gray-400">
            {{#if readingTime}}
            <span>{{readingTime}} 分钟</span>
            {{/if}}
            
            <div class="flex items-center space-x-2">
              {{#if category}}
              <a href="/categories/{{category.slug}}/" class="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-primary/10 text-primary hover:bg-primary/20 transition-colors">
                {{category}}
              </a>
              {{/if}}
              
              {{#each tags}}
              <a href="/tags/{{slug}}/" class="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                {{this}}
              </a>
              {{/each}}
            </div>
          </div>
        </article>
        {{/each}}
      </div>
    </div>
    {{/each}}
  </div>
  
  <!-- Statistics -->
  <div class="bg-surface rounded-lg shadow-sm p-6">
    <h2 class="text-2xl font-bold text-text dark:text-white mb-4">统计信息</h2>
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div class="text-center">
        <div class="text-2xl font-bold text-primary">{{stats.totalPosts}}</div>
        <div class="text-sm text-text-secondary dark:text-gray-400">文章总数</div>
      </div>
      <div class="text-center">
        <div class="text-2xl font-bold text-primary">{{stats.totalCategories}}</div>
        <div class="text-sm text-text-secondary dark:text-gray-400">分类数量</div>
      </div>
      <div class="text-center">
        <div class="text-2xl font-bold text-primary">{{stats.totalTags}}</div>
        <div class="text-sm text-text-secondary dark:text-gray-400">标签数量</div>
      </div>
      <div class="text-center">
        <div class="text-2xl font-bold text-primary">{{stats.totalArchives}}</div>
        <div class="text-sm text-text-secondary dark:text-gray-400">归档月份</div>
      </div>
    </div>
    
    {{#if stats.totalWords}}
    <div class="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
      <div class="text-center">
        <div class="text-lg font-bold text-text dark:text-white">{{stats.totalWords}}</div>
        <div class="text-sm text-text-secondary dark:text-gray-400">总字数</div>
      </div>
      <div class="text-center">
        <div class="text-lg font-bold text-text dark:text-white">{{stats.totalReadingTime}}</div>
        <div class="text-sm text-text-secondary dark:text-gray-400">总阅读时间（分钟）</div>
      </div>
      <div class="text-center">
        <div class="text-lg font-bold text-text dark:text-white">{{stats.averageWordsPerPost}}</div>
        <div class="text-sm text-text-secondary dark:text-gray-400">平均字数</div>
      </div>
    </div>
    {{/if}}
  </div>
</div>`;
  }

  /**
   * 默认搜索页面模板
   */
  private getDefaultSearchTemplate(): string {
    return `<div class="space-y-8">
  <header class="text-center py-8">
    <h1 class="text-4xl font-bold text-text dark:text-white mb-4">
      搜索文章
    </h1>
    <p class="text-lg text-text-secondary dark:text-gray-400">
      输入关键词搜索文章内容
    </p>
  </header>
  
  <!-- Search form -->
  <div class="max-w-2xl mx-auto">
    <div class="relative">
      <input 
        type="text" 
        id="search-input" 
        placeholder="{{config.search.placeholder}}"
        class="w-full px-4 py-3 pl-12 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-text dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
      >
      <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
        </svg>
      </div>
    </div>
  </div>
  
  <!-- Search results -->
  <div id="search-results" class="space-y-6">
    <!-- Results will be displayed here -->
  </div>
  
  <!-- No results message -->
  <div id="no-results" class="text-center py-12 hidden">
    <div class="text-6xl mb-4">🔍</div>
    <h3 class="text-xl font-medium text-text dark:text-white mb-2">未找到相关文章</h3>
    <p class="text-text-secondary dark:text-gray-400">请尝试其他关键词</p>
  </div>
</div>`;
  }

  /**
   * 默认404页面模板
   */
  private getDefault404Template(): string {
    return `<div class="text-center py-16">
  <div class="text-9xl font-bold text-primary mb-4">404</div>
  <h1 class="text-4xl font-bold text-text dark:text-white mb-4">页面未找到</h1>
  <p class="text-xl text-text-secondary dark:text-gray-400 mb-8">
    抱歉，您访问的页面不存在
  </p>
  <a href="/" class="inline-flex items-center px-6 py-3 rounded-lg bg-primary text-white hover:bg-primary/90 transition-colors">
    返回首页
  </a>
</div>`;
  }
}