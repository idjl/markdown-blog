module.exports = {
  title: 'Markdown Blog',
  description: 'A modern static blog system built with Markdown',
  author: 'Your Name',
  url: 'https://idjl.github.io',
  baseUrl: '/markdown-blog/',
  language: 'zh-CN',
  timezone: 'Asia/Shanghai',
  
  // 主题配置
  theme: {
    primary: '#3b82f6',
    secondary: '#64748b',
    accent: '#8b5cf6',
    background: '#ffffff',
    surface: '#f8fafc',
    text: '#1f2937',
    textSecondary: '#6b7280',
  },
  
  // 暗色主题
  darkTheme: {
    primary: '#60a5fa',
    secondary: '#94a3b8',
    accent: '#a78bfa',
    background: '#0f172a',
    surface: '#1e293b',
    text: '#f9fafb',
    textSecondary: '#d1d5db',
  },
  
  // 社交链接
  social: {
    github: 'yourusername',
    twitter: 'yourusername',
    email: 'your.email@example.com',
    rss: true,
  },
  
  // 文章配置
  posts: {
    perPage: 10,
    excerptLength: 200,
    dateFormat: 'YYYY-MM-DD',
    showDate: true,
    showAuthor: true,
    showTags: true,
    showCategories: true,
  },
  
  // 评论系统
  comments: {
    provider: 'utterances', // utterances, giscus
    repo: 'yourusername/your-repo-name',
    issueTerm: 'pathname',
    theme: 'github-light',
    darkTheme: 'github-dark',
  },
  
  // 搜索配置
  search: {
    enabled: true,
    placeholder: '搜索文章...',
    maxResults: 10,
  },
  
  // 分析配置
  analytics: {
    google: '', // Google Analytics ID
    baidu: '', // 百度统计 ID
  },
  
  // SEO配置
  seo: {
    keywords: ['blog', 'markdown', 'static-site'],
    author: 'Your Name',
    twitterCard: 'summary_large_image',
    ogImage: '/assets/og-image.png',
  },
  
  // 构建配置
  build: {
    outputDir: 'dist',
    assetsDir: 'assets',
    clean: true,
    minify: true,
    sourcemap: false,
  },
  
  // 开发配置
  dev: {
    port: 3000,
    host: 'localhost',
    open: true,
    hot: true,
  },
  
  // 插件配置
  plugins: {
    syntaxHighlight: {
      enabled: true,
      theme: 'github',
      darkTheme: 'github-dark',
    },
    rss: {
      enabled: true,
      title: 'Markdown Blog RSS',
      description: 'Latest posts from Markdown Blog',
      language: 'zh-CN',
      ttl: 60,
    },
    sitemap: {
      enabled: true,
      hostname: 'https://yourusername.github.io',
      changefreq: 'weekly',
      priority: 0.8,
    },
    pwa: {
      enabled: false,
      name: 'Markdown Blog',
      shortName: 'Blog',
      description: 'A modern static blog system',
      themeColor: '#3b82f6',
      backgroundColor: '#ffffff',
    },
  },

};
