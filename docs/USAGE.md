# 使用指南 | Usage Guide

## 目录 | Table of Contents

1. [快速开始 | Quick Start](#快速开始--quick-start)
2. [文章写作 | Writing Posts](#文章写作--writing-posts)
3. [配置详解 | Configuration](#配置详解--configuration)
4. [主题定制 | Theme Customization](#主题定制--theme-customization)
5. [部署指南 | Deployment Guide](#部署指南--deployment-guide)
6. [高级功能 | Advanced Features](#高级功能--advanced-features)
7. [故障排除 | Troubleshooting](#故障排除--troubleshooting)

## 快速开始 | Quick Start

### 1. 安装依赖 | Install Dependencies

```bash
npm install
```

### 2. 创建第一篇文章 | Create Your First Post

在 `posts/` 目录下创建一个新的 Markdown 文件：

```bash
mkdir -p posts
echo '---
title: "我的第一篇文章"
date: 2024-01-15
category: "生活"
tags: ["开始", "博客"]
description: "欢迎来到我的博客"
---

# 你好，世界！

这是我的第一篇文章。

## 关于这个博客

这个博客使用 Markdown 编写，支持：

- **粗体文本**
- *斜体文本*
- `代码片段`
- [链接](https://example.com)

> 引用文本

```javascript
console.log("Hello, World!");
```

感谢阅读！' > posts/my-first-post.md
```

### 3. 启动开发服务器 | Start Development Server

```bash
npm run dev
```

访问 `http://localhost:3000` 查看你的博客。

### 4. 构建生产版本 | Build for Production

```bash
npm run build
```

构建后的文件在 `dist/` 目录中。

## 文章写作 | Writing Posts

### Front Matter 格式

每篇文章的开头需要包含 YAML 格式的 Front Matter：

```yaml
---
title: "文章标题"
date: 2024-01-15              # 发布日期
category: "技术"               # 分类
tags: ["JavaScript", "React"] # 标签数组
description: "文章描述"        # 简短描述
coverImage: "/assets/images/cover.jpg" # 封面图片（可选）
author: "作者名"              # 作者（可选，默认使用配置中的作者）
readingTime: 5                # 预计阅读时间（分钟，可选）
draft: false                  # 是否为草稿（可选）
---
```

### Markdown 语法示例

```markdown
# 标题 1
## 标题 2
### 标题 3

**粗体文本** 和 *斜体文本*

~~删除线~~ 和 `行内代码`

> 引用文本
> 可以有多行

[链接文本](https://example.com)
![图片alt文本](/path/to/image.jpg)

## 列表

### 无序列表
- 项目 1
- 项目 2
  - 子项目 A
  - 子项目 B

### 有序列表
1. 第一步
2. 第二步
   1. 子步骤 A
   2. 子步骤 B

### 任务列表
- [x] 已完成的任务
- [ ] 未完成的任务
- [ ] 另一个任务

## 代码块

```javascript
function greet(name) {
  console.log(`Hello, ${name}!`);
}

greet('World');
```

## 表格

| 标题 1 | 标题 2 | 标题 3 |
|--------|--------|--------|
| 内容 1 | 内容 2 | 内容 3 |
| 内容 4 | 内容 5 | 内容 6 |

## 分割线

---

## 自定义容器

::: tip
这是一个提示框
:::

::: warning
这是一个警告框
:::

::: danger
这是一个危险警告框
:::
```

### 图片管理

1. **本地图片**
   将图片放在 `public/assets/images/` 目录下，然后在文章中使用：
   ```markdown
   ![描述](/assets/images/my-image.jpg)
   ```

2. **外部图片**
   直接使用外部图片链接：
   ```markdown
   ![描述](https://example.com/image.jpg)
   ```

3. **封面图片**
   在 Front Matter 中设置：
   ```yaml
   coverImage: "/assets/images/cover.jpg"
   ```

## 配置详解 | Configuration

### 基础配置 | Basic Configuration

```javascript
// blog.config.js
export default {
  // 站点信息
  title: "我的博客",                    // 站点标题
  description: "分享技术与生活",       // 站点描述
  author: "你的名字",                  // 默认作者
  url: "https://yourusername.github.io", // 站点URL
  language: "zh-CN",                   // 语言
  timezone: "Asia/Shanghai",          // 时区
  
  // 主题配置
  theme: {
    primary: "#3b82f6",      // 主色调
    secondary: "#64748b",    // 次要色调
    accent: "#f59e0b",       // 强调色
    background: "#ffffff",   // 背景色
    surface: "#f8fafc",      // 表面色
    text: "#1e293b",         // 文本色
    textSecondary: "#64748b", // 次要文本色
  },
  
  // 暗色主题
  darkTheme: {
    primary: "#60a5fa",
    secondary: "#94a3b8",
    accent: "#fbbf24",
    background: "#0f172a",
    surface: "#1e293b",
    text: "#f1f5f9",
    textSecondary: "#94a3b8",
  },
};
```

### 文章配置 | Posts Configuration

```javascript
posts: {
  perPage: 10,              // 每页显示文章数
  excerptLength: 200,      // 摘要长度（字符数）
  dateFormat: "YYYY-MM-DD", // 日期格式
  showReadingTime: true,    // 显示预计阅读时间
  showWordCount: true,      // 显示字数统计
  sortBy: "date",           // 排序方式: date, title, category
  sortOrder: "desc",        // 排序顺序: asc, desc
}
```

### 评论系统 | Comments System

#### Utterances 配置

```javascript
comments: {
  enabled: true,
  provider: "utterances",
  repo: "yourusername/yourrepo",      // GitHub 仓库
  issueTerm: "pathname",              // 议题标题方式
  theme: "github-light",              // 主题: github-light, github-dark
  label: "comment",                   // 标签（可选）
}
```

#### Giscus 配置

```javascript
comments: {
  enabled: true,
  provider: "giscus",
  repo: "yourusername/yourrepo",
  repoId: "your-repo-id",             // 仓库ID
  category: "General",                // 讨论分类
  categoryId: "your-category-id",    // 分类ID
  mapping: "pathname",                // 映射方式
  reactionsEnabled: "1",              // 启用反应
  emitMetadata: "0",                  // 发送元数据
  theme: "light",                     // 主题
  lang: "zh-CN",                      // 语言
}
```

### 搜索配置 | Search Configuration

```javascript
search: {
  enabled: true,            // 启用搜索
  placeholder: "搜索文章...", // 搜索框占位符
  maxResults: 10,           // 最大搜索结果数
  searchDelay: 300,         // 搜索延迟（毫秒）
  highlightResults: true,   // 高亮搜索结果
}
```

### SEO 配置 | SEO Configuration

```javascript
seo: {
  keywords: ["博客", "技术", "前端"],     // 默认关键词
  ogImage: "/assets/images/og-image.png", // OpenGraph 图片
  twitterCard: "summary_large_image",     // Twitter 卡片类型
  twitterSite: "@yourusername",           // Twitter 站点
  twitterCreator: "@yourusername",        // Twitter 创建者
  canonicalUrl: true,                    // 启用规范URL
}
```

### 社交链接 | Social Links

```javascript
social: {
  github: "yourusername",      // GitHub 用户名
  twitter: "yourusername",     // Twitter 用户名
  email: "your@email.com",     // 邮箱地址
  rss: true,                   // 启用 RSS 链接
  linkedin: "yourusername",    // LinkedIn 用户名
  facebook: "yourusername",  // Facebook 用户名
  instagram: "yourusername", // Instagram 用户名
}
```

### 构建配置 | Build Configuration

```javascript
build: {
  outputDir: "dist",        // 输出目录
  clean: true,              // 构建前清理输出目录
  minify: true,             // 压缩 HTML/CSS/JS
  sourcemap: false,         // 生成 source map
  gzip: true,               // 生成 gzip 压缩文件
}
```

### 开发配置 | Development Configuration

```javascript
dev: {
  port: 3000,               // 开发服务器端口
  host: "localhost",        // 开发服务器主机
  open: true,               // 自动打开浏览器
  hot: true,                // 启用热重载
  cors: true,               // 启用 CORS
}
```

### RSS 配置 | RSS Configuration

```javascript
plugins: {
  rss: {
    enabled: true,            // 启用 RSS
    title: "博客 RSS 订阅",     // RSS 标题
    description: "最新文章订阅", // RSS 描述
    language: "zh-CN",        // 语言
    copyright: "© 2024 作者", // 版权信息
    ttl: 60,                  // 缓存时间（分钟）
  },
  
  sitemap: {
    enabled: true,            // 启用站点地图
    hostname: "https://yourdomain.com", // 主机名
    changefreq: "weekly",     // 更新频率
    priority: 0.8,            // 默认优先级
  },
}
```

## 主题定制 | Theme Customization

### 修改颜色方案

编辑 `blog.config.js` 中的主题配置：

```javascript
theme: {
  primary: "#your-color",      // 主色调
  secondary: "#your-color",   // 次要色调
  accent: "#your-color",      // 强调色
  background: "#your-color",  // 背景色
  surface: "#your-color",     // 表面色
  text: "#your-color",        // 文本色
  textSecondary: "#your-color", // 次要文本色
}
```

### 自定义 CSS

创建 `src/assets/css/custom.css` 文件：

```css
/* 自定义样式 */
.custom-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.custom-post-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--primary);
}
```

然后在模板中引用：

```html
<link rel="stylesheet" href="/assets/css/custom.css">
```

### 修改模板

编辑 `src/templates/` 目录下的模板文件：

1. **布局模板** (`layout.html`) - 修改整体布局
2. **首页模板** (`index.html`) - 修改首页样式
3. **文章模板** (`post.html`) - 修改文章页面
4. **其他页面模板** - 修改对应页面

### 添加自定义页面

1. 创建新的模板文件，如 `src/templates/about.html`
2. 在静态生成器中添加生成逻辑
3. 更新导航菜单

## 部署指南 | Deployment Guide

### GitHub Pages 部署

#### 1. 创建 GitHub 仓库

1. 登录 GitHub
2. 创建新仓库，命名为 `yourusername.github.io`（用户/组织站点）或任意名称（项目站点）

#### 2. 启用 GitHub Pages

1. 进入仓库 Settings > Pages
2. Source 选择 "GitHub Actions"

#### 3. 推送代码

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/yourusername/yourrepo.git
git push -u origin main
```

#### 4. 访问博客

- 用户站点：`https://yourusername.github.io`
- 项目站点：`https://yourusername.github.io/yourrepo`

### 自定义域名 | Custom Domain

#### 1. 配置 DNS

添加 CNAME 记录：
- 记录类型：CNAME
- 主机记录：www（或 @）
- 记录值：yourusername.github.io

#### 2. 更新配置

在 `blog.config.js` 中：

```javascript
url: "https://yourdomain.com"
```

#### 3. 创建 CNAME 文件

创建 `public/CNAME` 文件：

```
yourdomain.com
```

### 其他平台部署 | Other Platforms

#### Netlify 部署

1. 访问 [Netlify](https://netlify.com)
2. 连接 GitHub 仓库
3. 设置构建命令：`npm run build`
4. 设置发布目录：`dist`

#### Vercel 部署

1. 访问 [Vercel](https://vercel.com)
2. 导入 GitHub 仓库
3. 设置框架预设：Vite
4. 自动部署

#### 阿里云 OSS 部署

1. 创建 OSS Bucket
2. 上传 `dist/` 目录内容
3. 配置静态网站托管
4. 设置自定义域名

## 高级功能 | Advanced Features

### 自定义插件开发

创建自定义插件：

```typescript
// src/plugins/my-plugin.ts
import { Plugin } from '../types';

export class MyPlugin implements Plugin {
  name = 'my-plugin';
  
  constructor(private options: any) {}
  
  apply(context: any): void {
    // 在构建过程中执行自定义逻辑
    context.hooks.on('beforeBuild', () => {
      console.log('Before build hook');
    });
    
    context.hooks.on('afterBuild', () => {
      console.log('After build hook');
    });
  }
}
```

### 添加分析代码

在 `src/templates/layout.html` 中添加分析代码：

```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>

<!-- 百度统计 -->
<script>
  var _hmt = _hmt || [];
  (function() {
    var hm = document.createElement("script");
    hm.src = "https://hm.baidu.com/hm.js?your-tracking-id";
    var s = document.getElementsByTagName("script")[0];
    s.parentNode.insertBefore(hm, s);
  })();
</script>
```

### 添加 PWA 支持

1. 创建 `public/manifest.json`：

```json
{
  "name": "我的博客",
  "short_name": "博客",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#3b82f6",
  "icons": [
    {
      "src": "/assets/images/icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/assets/images/icon-512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

2. 在 `src/templates/layout.html` 中添加：

```html
<link rel="manifest" href="/manifest.json">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="default">
<meta name="apple-mobile-web-app-title" content="我的博客">
```

## 故障排除 | Troubleshooting

### 常见问题 | Common Issues

#### 1. 构建失败 | Build Failed

**问题**：构建过程中出现错误

**解决方案**：
- 检查 Markdown 文件格式是否正确
- 确认 Front Matter 格式正确
- 查看控制台错误信息
- 检查配置文件语法

#### 2. 样式不生效 | Styles Not Working

**问题**：CSS 样式没有正确应用

**解决方案**：
- 确认 CSS 文件路径正确
- 检查浏览器缓存
- 确认 Tailwind CSS 配置正确
- 检查构建输出是否包含 CSS 文件

#### 3. 评论系统不工作 | Comments Not Working

**问题**：评论系统无法加载

**解决方案**：
- 检查 GitHub 仓库是否公开
- 确认评论系统配置正确
- 检查浏览器控制台错误
- 确认仓库启用了 Issues 或 Discussions

#### 4. 搜索功能不工作 | Search Not Working

**问题**：搜索功能无法使用

**解决方案**：
- 确认 `search-index.json` 已生成
- 检查浏览器控制台错误
- 确认 JavaScript 已正确加载
- 检查搜索配置是否启用

#### 5. 部署失败 | Deployment Failed

**问题**：GitHub Actions 部署失败

**解决方案**：
- 检查 Actions 日志
- 确认仓库设置正确
- 检查权限配置
- 确认构建命令正确

### 调试技巧 | Debugging Tips

#### 1. 启用详细日志

```bash
DEBUG=blog:* npm run dev
```

#### 2. 检查构建输出

```bash
npm run build -- --verbose
```

#### 3. 验证配置

```bash
npm run validate-config
```

#### 4. 检查文件结构

```bash
npm run debug:structure
```

#### 5. 测试单个文件

```bash
npm run debug:post -- posts/my-post.md
```

### 性能优化 | Performance Optimization

#### 1. 优化图片

- 压缩图片大小
- 使用适当的图片格式（WebP）
- 设置合理的图片尺寸

#### 2. 启用压缩

在配置中启用压缩选项：

```javascript
build: {
  minify: true,
  gzip: true,
  brotli: true,
}
```

#### 3. 使用 CDN

将静态资源上传到 CDN，并在配置中设置：

```javascript
cdn: {
  enabled: true,
  url: "https://cdn.yourdomain.com",
}
```

#### 4. 缓存策略

配置适当的缓存策略：

```javascript
cache: {
  maxAge: 31536000, // 1年
  etag: true,
  lastModified: true,
}
```

---

**需要帮助？** | **Need Help?**

- 📧 邮件联系：your@email.com
- 🐛 提交 Issue：[GitHub Issues](https://github.com/yourusername/markdown-blog/issues)
- 💬 加入讨论：[GitHub Discussions](https://github.com/yourusername/markdown-blog/discussions)

**祝写作愉快！** | **Happy Writing!** 🎉