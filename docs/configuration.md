# Markdown Blog Configuration

This document describes all available configuration options for the Markdown Blog system.

## Basic Configuration

### Site Information

```javascript
export default {
  title: 'Your Blog Title',
  description: 'Your blog description',
  author: 'Your Name',
  url: 'https://yourusername.github.io',
  baseUrl: '/your-repo-name/',
  language: 'zh-CN',
  timezone: 'Asia/Shanghai',
};
```

### Theme Configuration

```javascript
theme: {
  primary: '#3b82f6',        // Primary color
  secondary: '#64748b',      // Secondary color
  accent: '#8b5cf6',         // Accent color
  background: '#ffffff',     // Background color
  surface: '#f8fafc',        // Surface color
  text: '#1f2937',           // Text color
  textSecondary: '#6b7280',  // Secondary text color
},

darkTheme: {
  primary: '#60a5fa',
  secondary: '#94a3b8',
  accent: '#a78bfa',
  background: '#0f172a',
  surface: '#1e293b',
  text: '#f9fafb',
  textSecondary: '#d1d5db',
},
```

### Social Links

```javascript
social: {
  github: 'yourusername',
  twitter: 'yourusername',
  email: 'your.email@example.com',
  rss: true,  // Enable RSS feed
},
```

## Post Configuration

```javascript
posts: {
  perPage: 10,              // Posts per page
  excerptLength: 200,       // Excerpt length in characters
  dateFormat: 'YYYY-MM-DD', // Date format
  showDate: true,           // Show post date
  showAuthor: true,         // Show post author
  showTags: true,           // Show post tags
  showCategories: true,     // Show post categories
},
```

## Comments Configuration

### Utterances

```javascript
comments: {
  provider: 'utterances',
  repo: 'yourusername/your-repo-name',
  issueTerm: 'pathname',  // 'pathname', 'title', 'og:title', 'issue-number', 'specific-term'
  theme: 'github-light',  // Theme for light mode
  darkTheme: 'github-dark', // Theme for dark mode
},
```

### Giscus

```javascript
comments: {
  provider: 'giscus',
  repo: 'yourusername/your-repo-name',
  repoId: 'your-repo-id',
  category: 'General',
  categoryId: 'your-category-id',
  mapping: 'pathname',
  reactionsEnabled: '1',
  emitMetadata: '0',
  theme: 'light',
  darkTheme: 'dark',
},
```

## Search Configuration

```javascript
search: {
  enabled: true,
  placeholder: 'Search posts...',
  maxResults: 10,
},
```

## Analytics Configuration

```javascript
analytics: {
  google: 'G-XXXXXXXXXX',  // Google Analytics ID
  baidu: 'your-baidu-id',   // Baidu Analytics ID
},
```

## SEO Configuration

```javascript
seo: {
  keywords: ['blog', 'markdown', 'static-site'],
  author: 'Your Name',
  twitterCard: 'summary_large_image',
  ogImage: '/assets/og-image.png',
},
```

## Build Configuration

```javascript
build: {
  outputDir: 'dist',
  assetsDir: 'assets',
  clean: true,
  minify: true,
  sourcemap: false,
},
```

## Development Configuration

```javascript
dev: {
  port: 3000,
  host: 'localhost',
  open: true,
  hot: true,
},
```

## Plugin Configuration

### Syntax Highlighting

```javascript
plugins: {
  syntaxHighlight: {
    enabled: true,
    theme: 'github',        // Light theme
    darkTheme: 'github-dark', // Dark theme
  },
},
```

Available themes:
- `github`, `github-dark`
- `vs`, `vs-dark`
- `atom-one-light`, `atom-one-dark`
- `monokai`, `monokai-sublime`
- `tomorrow`, `tomorrow-night`
- And many more...

### RSS Feed

```javascript
plugins: {
  rss: {
    enabled: true,
    title: 'Your Blog RSS',
    description: 'Latest posts from Your Blog',
    language: 'zh-CN',
    ttl: 60,  // Time to live in minutes
  },
},
```

### Sitemap

```javascript
plugins: {
  sitemap: {
    enabled: true,
    hostname: 'https://yourusername.github.io',
    changefreq: 'weekly',  // 'always', 'hourly', 'daily', 'weekly', 'monthly', 'yearly', 'never'
    priority: 0.8,         // 0.0 to 1.0
  },
},
```

### Progressive Web App (PWA)

```javascript
plugins: {
  pwa: {
    enabled: true,
    name: 'Your Blog',
    shortName: 'Blog',
    description: 'Your blog description',
    themeColor: '#3b82f6',
    backgroundColor: '#ffffff',
  },
},
```

## Complete Example

Here's a complete configuration example:

```javascript
export default {
  title: 'My Tech Blog',
  description: 'Sharing my thoughts on technology and programming',
  author: 'John Doe',
  url: 'https://johndoe.github.io',
  baseUrl: '/my-tech-blog/',
  language: 'zh-CN',
  timezone: 'Asia/Shanghai',
  
  theme: {
    primary: '#2563eb',
    secondary: '#64748b',
    accent: '#7c3aed',
    background: '#ffffff',
    surface: '#f8fafc',
    text: '#1f2937',
    textSecondary: '#6b7280',
  },
  
  darkTheme: {
    primary: '#60a5fa',
    secondary: '#94a3b8',
    accent: '#a78bfa',
    background: '#0f172a',
    surface: '#1e293b',
    text: '#f9fafb',
    textSecondary: '#d1d5db',
  },
  
  social: {
    github: 'johndoe',
    twitter: 'johndoe',
    email: 'john@example.com',
    rss: true,
  },
  
  posts: {
    perPage: 8,
    excerptLength: 300,
    dateFormat: 'YYYY-MM-DD',
    showDate: true,
    showAuthor: true,
    showTags: true,
    showCategories: true,
  },
  
  comments: {
    provider: 'utterances',
    repo: 'johndoe/my-tech-blog',
    issueTerm: 'pathname',
    theme: 'github-light',
    darkTheme: 'github-dark',
  },
  
  search: {
    enabled: true,
    placeholder: '搜索技术文章...',
    maxResults: 15,
  },
  
  analytics: {
    google: 'G-XXXXXXXXXX',
  },
  
  seo: {
    keywords: ['technology', 'programming', 'web development', 'javascript'],
    author: 'John Doe',
    twitterCard: 'summary_large_image',
    ogImage: '/assets/og-image.png',
  },
  
  build: {
    outputDir: 'dist',
    assetsDir: 'assets',
    clean: true,
    minify: true,
    sourcemap: false,
  },
  
  dev: {
    port: 3000,
    host: 'localhost',
    open: true,
    hot: true,
  },
  
  plugins: {
    syntaxHighlight: {
      enabled: true,
      theme: 'github',
      darkTheme: 'github-dark',
    },
    rss: {
      enabled: true,
      title: 'My Tech Blog RSS',
      description: 'Latest technology posts from John Doe',
      language: 'zh-CN',
      ttl: 60,
    },
    sitemap: {
      enabled: true,
      hostname: 'https://johndoe.github.io',
      changefreq: 'weekly',
      priority: 0.8,
    },
  },
};
```

## Environment Variables

You can also configure some options using environment variables:

```bash
# Site configuration
BLOG_TITLE="My Blog"
BLOG_DESCRIPTION="My blog description"
BLOG_URL="https://myblog.com"

# Analytics
GOOGLE_ANALYTICS_ID="G-XXXXXXXXXX"
BAIDU_ANALYTICS_ID="your-baidu-id"

# Comments
GITHUB_REPO="username/repo-name"
```

These environment variables will override the corresponding configuration options.