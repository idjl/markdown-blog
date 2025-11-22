# 部署指南 | Deployment Guide

## 目录 | Table of Contents

1. [GitHub Pages 部署](#github-pages-部署)
2. [自定义域名配置](#自定义域名配置)
3. [其他平台部署](#其他平台部署)
4. [CI/CD 配置](#cicd-配置)
5. [性能优化](#性能优化)
6. [监控和分析](#监控和分析)

## GitHub Pages 部署

### 1. 创建 GitHub 仓库

#### 用户/组织站点
- 仓库名称必须为：`yourusername.github.io`
- 例如：如果你的用户名是 `johndoe`，仓库名就是 `johndoe.github.io`

#### 项目站点
- 仓库名称可以是任意名称，如 `my-blog`
- 访问地址：`https://yourusername.github.io/my-blog`

### 2. 初始化仓库

```bash
# 在本地项目目录中
git init
git add .
git commit -m "Initial commit"

# 添加远程仓库
git remote add origin https://github.com/yourusername/yourrepo.git
git push -u origin main
```

### 3. 启用 GitHub Pages

1. 进入 GitHub 仓库页面
2. 点击 Settings 选项卡
3. 向下滚动到 Pages 部分
4. Source 选择 "GitHub Actions"
5. 保存设置

### 4. 配置 GitHub Actions

项目已经包含了完整的 GitHub Actions 工作流配置：

#### 主要工作流 | Main Workflow
文件：`.github/workflows/deploy.yml`

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main, master ]
  pull_request:
    branches: [ main, master ]

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
        
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'
          
      - name: Setup Pages
        id: pages
        uses: actions/configure-pages@v4
        
      - name: Install dependencies
        run: npm ci
        
      - name: Build site
        run: npm run build
        
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: ./dist

  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.pages_url }}
    runs-on: ubuntu-latest
    needs: build
    if: github.ref == 'refs/heads/main' || github.ref == 'refs/heads/master'
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

#### 测试工作流 | Test Workflow
文件：`.github/workflows/test.yml`

```yaml
name: Test and Build

on:
  push:
    branches: [ main, master, develop ]
  pull_request:
    branches: [ main, master, develop ]

jobs:
  test:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        node-version: [16.x, 18.x, 20.x]
    steps:
      - name: Checkout
        uses: actions/checkout@v4
        
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.node-version }}
          cache: 'npm'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Run linter
        run: npm run lint
        
      - name: Run type check
        run: npm run typecheck
        
      - name: Run tests
        run: npm test
        
      - name: Build site
        run: npm run build
```

#### 定时构建工作流 | Scheduled Workflow
文件：`.github/workflows/scheduled.yml`

```yaml
name: Scheduled Build

on:
  schedule:
    - cron: '0 2 * * *'  # 每天凌晨2点运行
  workflow_dispatch:      # 允许手动触发

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
        
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Build site
        run: npm run build
        
      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v4
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
          cname: ${{ vars.CUSTOM_DOMAIN }}
```

### 5. 环境变量配置

在 GitHub 仓库设置中添加以下环境变量：

#### 仓库变量 | Repository Variables
- `CUSTOM_DOMAIN`: 自定义域名（如 `blog.yourdomain.com`）
- `SITE_URL`: 站点URL
- `ANALYTICS_ID`: 分析工具ID

#### 仓库密钥 | Repository Secrets
- `GITHUB_TOKEN`: 自动提供，无需手动设置
- `DEPLOY_KEY`: SSH部署密钥（如果需要）

## 自定义域名配置

### 1. DNS 配置

#### 子域名配置（推荐）
添加 CNAME 记录：
- 类型：CNAME
- 主机记录：`blog`（或 `www`）
- 记录值：`yourusername.github.io`

#### 根域名配置
添加 A 记录：
- 类型：A
- 主机记录：`@`
- 记录值：
  ```
  185.199.108.153
  185.199.109.153
  185.199.110.153
  185.199.111.153
  ```

或者添加 AAAA 记录：
- 类型：AAAA
- 主机记录：`@`
- 记录值：`2606:50c0:8000::153` 到 `2606:50c0:800f::153`

### 2. 配置更新

更新 `blog.config.js`：

```javascript
export default {
  url: "https://blog.yourdomain.com",  // 更新为你的域名
  // ... 其他配置
};
```

### 3. CNAME 文件

创建 `public/CNAME` 文件：

```
blog.yourdomain.com
```

### 4. HTTPS 配置

GitHub Pages 会自动为自定义域名提供 HTTPS 证书：

1. 进入仓库 Settings > Pages
2. 找到 "Enforce HTTPS" 选项
3. 勾选启用 HTTPS

### 5. 高级 DNS 配置

#### Cloudflare 配置（推荐）
如果使用 Cloudflare，可以获得更好的性能和安全：

1. 将域名 DNS 服务器改为 Cloudflare
2. 添加 CNAME 记录：
   - 名称：`blog`
   - 目标：`yourusername.github.io`
   - 代理状态：DNS only（灰色云）
3. 在 Cloudflare 中启用：
   - SSL/TLS 加密模式：Full
   - 自动 HTTPS 重写：开启
   - 始终使用 HTTPS：开启

#### 多域名配置

支持多个域名指向同一个博客：

```javascript
// blog.config.js
export default {
  url: "https://primary-domain.com",
  aliases: [
    "https://secondary-domain.com",
    "https://another-domain.com"
  ],
  // ...
};
```

## 其他平台部署

### Netlify 部署

#### 1. 连接仓库

1. 访问 [Netlify](https://netlify.com)
2. 点击 "New site from Git"
3. 选择 GitHub 并授权
4. 选择你的博客仓库

#### 2. 构建设置

- Build command: `npm run build`
- Publish directory: `dist`

#### 3. 环境变量

在 Netlify 控制台设置环境变量：
- `NODE_VERSION`: `18`
- `NPM_VERSION`: `9`

#### 4. 自定义域名

1. 进入 Site settings > Domain management
2. 点击 "Add custom domain"
3. 输入你的域名
4. 按照提示配置 DNS

### Vercel 部署

#### 1. 连接仓库

1. 访问 [Vercel](https://vercel.com)
2. 点击 "New Project"
3. 导入 GitHub 仓库

#### 2. 配置项目

- Framework Preset: Vite
- Build Command: `npm run build`
- Output Directory: `dist`
- Install Command: `npm install`

#### 3. 环境变量

在 Vercel 控制台设置环境变量：
- `NODE_VERSION`: `18`

#### 4. 自定义域名

1. 进入 Project Settings > Domains
2. 点击 "Add Domain"
3. 输入你的域名
4. 按照提示配置 DNS

### 阿里云 OSS 部署

#### 1. 创建 Bucket

1. 登录阿里云控制台
2. 进入 OSS 服务
3. 创建新的 Bucket
4. 选择地域和存储类型

#### 2. 配置静态网站托管

在 Bucket 设置中：
- 开启静态网站托管
- 设置默认首页：`index.html`
- 设置默认 404 页：`404.html`

#### 3. 上传文件

```bash
# 安装阿里云 CLI
npm install -g @alicloud/cli

# 配置认证
alicloud configure

# 上传文件
alicloud oss cp ./dist/ oss://your-bucket-name/ --recursive
```

#### 4. 自定义域名

1. 在 OSS 控制台添加自定义域名
2. 配置 CNAME 指向 Bucket 域名
3. 申请 SSL 证书（可选）

### 腾讯云 COS 部署

#### 1. 创建存储桶

1. 登录腾讯云控制台
2. 进入 COS 服务
3. 创建新的存储桶

#### 2. 配置静态网站

在存储桶设置中：
- 开启静态网站
- 设置索引文档：`index.html`
- 设置错误文档：`404.html`

#### 3. 上传文件

```bash
# 使用 COS CLI
npm install -g cos-nodejs-sdk-v5

# 上传文件
cos-cli upload -r ./dist/ cos://your-bucket-name/
```

#### 4. 自定义域名

1. 在 COS 控制台添加自定义域名
2. 配置 CNAME 指向存储桶域名
3. 配置 CDN 加速（可选）

## CI/CD 配置

### 多环境部署

#### 1. 开发环境

```yaml
# .github/workflows/dev-deploy.yml
name: Deploy to Development

on:
  push:
    branches: [ develop ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run build
      - name: Deploy to dev
        run: |
          # 部署到开发环境
          echo "Deploying to development environment"
```

#### 2. 预发布环境

```yaml
# .github/workflows/staging-deploy.yml
name: Deploy to Staging

on:
  push:
    branches: [ staging ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run build
      - name: Deploy to staging
        run: |
          # 部署到预发布环境
          echo "Deploying to staging environment"
```

#### 3. 生产环境

```yaml
# .github/workflows/prod-deploy.yml
name: Deploy to Production

on:
  push:
    branches: [ main ]
  release:
    types: [ published ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run build
      - name: Deploy to production
        run: |
          # 部署到生产环境
          echo "Deploying to production environment"
```

### 自动化测试

#### 1. 单元测试

```yaml
- name: Run unit tests
  run: npm run test:unit

- name: Run integration tests
  run: npm run test:integration

- name: Run e2e tests
  run: npm run test:e2e
```

#### 2. 性能测试

```yaml
- name: Run Lighthouse CI
  run: |
    npm install -g @lhci/cli
    lhci autorun
```

#### 3. 安全检查

```yaml
- name: Security audit
  run: npm audit

- name: Check for vulnerabilities
  run: npm audit fix --dry-run
```

### 回滚策略

#### 1. 自动回滚

```yaml
- name: Deploy with rollback
  run: |
    # 部署新版本
    npm run deploy
    
    # 检查健康状态
    if ! curl -f https://yourdomain.com/health; then
      echo "Deployment failed, rolling back..."
      npm run rollback
      exit 1
    fi
```

#### 2. 蓝绿部署

```yaml
- name: Blue-green deployment
  run: |
    # 部署到绿色环境
    npm run deploy:green
    
    # 切换流量
    npm run switch:green
    
    # 验证后删除蓝色环境
    npm run cleanup:blue
```

## 性能优化

### 构建优化

#### 1. 资源压缩

```javascript
// blog.config.js
export default {
  build: {
    minify: true,
    gzip: true,
    brotli: true,
    optimizeImages: true,
  },
};
```

#### 2. 代码分割

```javascript
// 启用代码分割
export default {
  build: {
    splitChunks: true,
    extractCSS: true,
  },
};
```

#### 3. 预加载策略

```html
<!-- 在模板中添加预加载 -->
<link rel="preload" href="/assets/css/main.css" as="style">
<link rel="preload" href="/assets/js/main.js" as="script">
<link rel="prefetch" href="/assets/js/search.js">
```

### CDN 配置

#### 1. 公共 CDN

```html
<!-- 使用公共 CDN -->
<script src="https://cdn.jsdelivr.net/npm/prismjs@1.29.0/prism.min.js"></script>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/prismjs@1.29.0/themes/prism.min.css">
```

#### 2. 自定义 CDN

```javascript
// blog.config.js
export default {
  cdn: {
    enabled: true,
    url: "https://cdn.yourdomain.com",
    include: ["css", "js", "images"],
    exclude: ["html"],
  },
};
```

### 缓存策略

#### 1. 浏览器缓存

```javascript
// 在服务器配置中添加
{
  "staticAssets": {
    "cacheControl": "public, max-age=31536000, immutable",
    "extensions": ["css", "js", "png", "jpg", "jpeg", "gif", "svg", "woff", "woff2"]
  },
  "htmlFiles": {
    "cacheControl": "public, max-age=3600"
  }
}
```

#### 2. Service Worker

```javascript
// src/assets/js/sw.js
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open('blog-v1').then((cache) => {
      return cache.addAll([
        '/',
        '/assets/css/main.css',
        '/assets/js/main.js',
        '/assets/js/search.js'
      ]);
    })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
```

## 监控和分析

### 网站分析

#### 1. Google Analytics

```html
<!-- Google Analytics 4 -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

#### 2. 百度统计

```html
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

#### 3. 其他分析工具

- [Plausible](https://plausible.io/) - 隐私友好的分析
- [Fathom](https://usefathom.com/) - 简单隐私分析
- [Matomo](https://matomo.org/) - 开源分析平台

### 性能监控

#### 1. Web Vitals

```javascript
// src/assets/js/analytics.js
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

function sendToAnalytics(metric) {
  // 发送到分析服务
  gtag('event', metric.name, {
    value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
    event_category: 'Web Vitals',
    event_label: metric.id,
    non_interaction: true,
  });
}

getCLS(sendToAnalytics);
getFID(sendToAnalytics);
getFCP(sendToAnalytics);
getLCP(sendToAnalytics);
getTTFB(sendToAnalytics);
```

#### 2. 性能预算

```javascript
// performance-budget.json
{
  "budgets": [
    {
      "path": "/*",
      "resourceSizes": [
        {
          "resourceType": "document",
          "budget": 100
        },
        {
          "resourceType": "script",
          "budget": 200
        },
        {
          "resourceType": "stylesheet",
          "budget": 100
        },
        {
          "resourceType": "image",
          "budget": 300
        },
        {
          "resourceType": "total",
          "budget": 800
        }
      ]
    }
  ]
}
```

### 错误监控

#### 1. Sentry 集成

```javascript
// src/assets/js/error-tracking.js
import * as Sentry from '@sentry/browser';

Sentry.init({
  dsn: 'your-sentry-dsn',
  integrations: [
    new Sentry.BrowserTracing(),
  ],
  tracesSampleRate: 1.0,
});
```

#### 2. 自定义错误处理

```javascript
window.addEventListener('error', (event) => {
  // 发送错误到分析服务
  gtag('event', 'exception', {
    description: event.message,
    fatal: false,
  });
});

window.addEventListener('unhandledrejection', (event) => {
  // 处理未处理的 Promise 拒绝
  gtag('event', 'exception', {
    description: event.reason,
    fatal: false,
  });
});
```

---

**部署完成！** 🎉

你的博客现在已经成功部署并配置了完整的 CI/CD 流程。记得定期检查部署状态和性能指标，确保博客始终保持最佳状态。

**需要帮助？** | **Need Help?**

- 📧 邮件联系：your@email.com
- 🐛 提交 Issue：[GitHub Issues](https://github.com/yourusername/markdown-blog/issues)
- 📖 查看文档：[使用指南](USAGE.md)