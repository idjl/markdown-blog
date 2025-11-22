# Markdown 博客生成器

一个现代化的 Markdown 静态博客生成器，支持响应式设计、主题切换、评论系统、搜索功能等。基于 TypeScript 和 Vite，开箱即用地支持 GitHub Pages 部署、语法高亮与优秀性能。

## 功能特性

### 核心功能
- Markdown 全量支持（表格、任务列表、代码块等）
- 响应式设计（桌面/平板/移动）
- 亮暗主题切换（跟随系统）
- 客户端全文搜索
- 评论系统（Utterances / Giscus）
- 代码语法高亮（Prism.js）

### SEO 与性能
- 完整的 SEO 元信息（meta、Open Graph、Twitter Card）
- 自动生成 RSS 订阅（RSS 2.0）
- 自动生成站点地图（sitemap.xml）
- Vite 驱动的快速构建
- 纯静态 HTML，加载迅速

### 部署与管理
- GitHub Actions 自动化部署到 GitHub Pages
- 支持自定义域名（CNAME）
- 规范的项目结构，易于维护
- 开发模式支持文件监听与热重载

## 快速开始

### 环境要求
- Node.js 18+
- npm 或 yarn

### 安装与启动
```bash
# 克隆仓库
git clone https://github.com/idjl/markdown-blog.git
cd markdown-blog

# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

### 撰写文章
在 `posts/` 目录新建 `.md` 文件，使用 Front Matter 编写元信息：
```markdown
---
title: "我的第一篇文章"
date: 2024-01-01
tags: ["blog", "markdown"]
category: "tech"
description: "这是我的第一篇博客文章"
---

# Hello World

这是我用 Markdown 写的第一篇文章！
```

## 构建与预览
```bash
# 生产构建
npm run build

# 预览生产构建
npm run preview
```
- 构建产物默认输出到 `dist/`
- 文章页面位于 `dist/posts/<slug>/index.html`
- 首页为 `dist/index.html`

## 部署到 GitHub Pages
1. 推送到 GitHub 仓库
2. 打开仓库 Settings → Pages，将 Source 设置为 “GitHub Actions”
3. 项目已包含工作流文件，推送后会自动构建并发布

## 配置
编辑 `blog.config.js` 自定义你的博客：
```javascript
export default {
  title: 'My Blog',
  description: 'A blog built with Markdown',
  author: 'Your Name',
  url: 'https://yourusername.github.io',
  social: {
    github: 'yourusername',
    twitter: 'yourusername',
  },
  theme: {
    primary: '#3b82f6',
    secondary: '#64748b',
  },
};
```
常用可配项：站点标题与描述、作者信息、主题色、社交账号、构建输出目录、开发服务器参数、RSS/Sitemap 等。

## 目录结构
```
markdown-blog/
├── src/                    # 源码
│   ├── core/              # 核心能力
│   ├── utils/             # 工具函数
│   ├── plugins/           # 插件
│   ├── templates/         # HTML 模板
│   └── styles/            # 样式
├── posts/                 # Markdown 文章
├── public/                # 静态资源
├── scripts/               # 构建脚本
├── dist/                  # 构建输出
└── .github/               # GitHub Actions
```

## 可用脚本
- `npm run dev`：启动开发服务器
- `npm run build`：生产构建
- `npm run preview`：预览生产构建
- `npm run clean`：清理构建目录
- `npm run lint`：代码检查
- `npm run lint:fix`：修复检查问题
- `npm run format`：格式化代码
- `npm run type-check`：类型检查
- `npm run test`：运行测试
- `npm run deploy`：部署到 GitHub Pages

## 自定义
- 主题：修改 `src/styles/theme.css` 或在配置中调整主题色
- 模板：编辑 `src/templates/` 以调整页面布局与结构
- 插件：在 `src/plugins/` 扩展功能（如搜索、高亮、评论等）

## 参与贡献
1. Fork 仓库
2. 创建特性分支：`git checkout -b feature/amazing-feature`
3. 提交修改：`git commit -m 'Add some amazing feature'`
4. 推送分支：`git push origin feature/amazing-feature`
5. 发起 Pull Request

## 许可证
本项目采用 MIT 许可证，详见 [LICENSE](LICENSE)。

## 致谢
- [Vite](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [markdown-it](https://github.com/markdown-it/markdown-it)
- [Prism.js](https://prismjs.com/)