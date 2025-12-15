# 项目问题修复总结

## 修复日期
2024-12-15

## 修复的问题

### 1. GitHub Actions 部署权限错误 ✅

**问题描述**:
```
remote: Permission to idjl/markdown-blog.git denied to github-actions[bot].
fatal: unable to access 'https://github.com/idjl/markdown-blog.git/': The requested URL returned error: 403
```

**原因分析**:
- `scheduled.yml` 工作流使用了旧的 `peaceiris/actions-gh-pages@v4` 部署方式
- 权限配置不正确（使用了 `contents: write` 而不是 `contents: read`）
- 与主部署工作流 `deploy.yml` 不一致

**修复方案**:
- 更新 `scheduled.yml` 使用与 `deploy.yml` 相同的官方 GitHub Pages 部署方式
- 使用 `actions/configure-pages@v4` 和 `actions/deploy-pages@v4`
- 正确配置权限：`contents: read`, `pages: write`, `id-token: write`
- 添加并发控制，避免多个部署同时进行

**需要的仓库配置**:
1. 在 GitHub 仓库 Settings → Pages 中，将 Source 设置为 "GitHub Actions"
2. 在 Settings → Actions → General 中，设置 Workflow permissions 为 "Read and write permissions"

### 2. 配置文件重复 ✅

**问题描述**:
- 项目中同时存在 `blog.config.js` 和 `blog.config.json` 两个配置文件
- 可能导致配置混乱和不一致

**修复方案**:
- 删除 `blog.config.json`
- 保留 `blog.config.js` 作为唯一配置文件
- 更新配置中的仓库信息为正确的 `idjl/markdown-blog`

### 3. .gitignore 配置问题 ✅

**问题描述**:
- `.gitignore` 文件中包含了 `posts/` 目录
- 这会导致博客文章无法提交到 Git 仓库
- 部署时会因为没有文章而失败

**修复方案**:
- 从 `.gitignore` 中移除 `posts/` 目录
- 从 `.gitignore` 中移除 `public/` 目录（如果需要静态资源）
- 保留 `dist/` 在 `.gitignore` 中（构建产物不应提交）

### 4. 仓库信息更新 ✅

**问题描述**:
- `package.json` 和 `blog.config.js` 中的仓库信息仍然是占位符
- 评论系统配置指向错误的仓库

**修复方案**:
- 更新 `package.json` 中的 repository、bugs、homepage 字段
- 更新 `blog.config.js` 中的 social.github 和 comments.repo 字段
- 所有配置统一指向 `idjl/markdown-blog`

### 5. 文档完善 ✅

**新增文档**:
- `docs/GITHUB_PAGES_SETUP.md` - GitHub Pages 详细配置指南
- `docs/FIXES_APPLIED.md` - 本文档，记录所有修复

**更新文档**:
- `README.md` - 添加部署配置说明链接

## 工作流说明

### deploy.yml - 主部署工作流
- **触发**: 推送到 main/master 分支
- **功能**: 自动构建并部署到 GitHub Pages
- **状态**: ✅ 已优化

### scheduled.yml - 定时构建工作流
- **触发**: 每天凌晨 2 点 / 手动触发
- **功能**: 定期重新构建网站
- **状态**: ✅ 已修复并与 deploy.yml 保持一致

### test.yml - 测试工作流
- **触发**: 推送或 PR 到 main/master/develop
- **功能**: 代码检查和测试
- **状态**: ✅ 正常

## 下一步操作

### 必须完成的配置

1. **GitHub 仓库设置**
   ```
   Settings → Pages → Source: GitHub Actions
   Settings → Actions → General → Workflow permissions: Read and write permissions
   ```

2. **验证部署**
   - 提交代码到 main 分支
   - 查看 Actions 标签页确认工作流运行成功
   - 访问 https://idjl.github.io/markdown-blog/ 验证网站

### 可选配置

1. **自定义域名**
   - 在 Settings → Pages 中配置
   - 添加 DNS CNAME 记录

2. **评论系统**
   - 如果使用 utterances，确保仓库是公开的
   - 安装 utterances GitHub App

3. **分析工具**
   - 在 `blog.config.js` 中添加 Google Analytics ID
   - 或添加百度统计 ID

## 技术栈确认

- ✅ Node.js 18+
- ✅ TypeScript 5.x
- ✅ Vite 4.x
- ✅ Tailwind CSS 3.x
- ✅ markdown-it 13.x
- ✅ GitHub Actions
- ✅ GitHub Pages

## 已知限制

1. **构建依赖**
   - 首次运行需要先编译 TypeScript (`npm run build`)
   - 构建脚本依赖 `dist/` 目录中的编译文件

2. **测试覆盖**
   - 当前测试配置存在但可能需要实际测试文件
   - 可以暂时跳过测试步骤

## 联系方式

如有问题，请在 GitHub Issues 中提出：
https://github.com/idjl/markdown-blog/issues
