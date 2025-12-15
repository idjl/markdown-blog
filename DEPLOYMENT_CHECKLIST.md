# 🚀 部署检查清单

在推送代码到 GitHub 之前，请确保完成以下配置：

## ✅ GitHub 仓库配置（必须）⚠️

### 1. 启用 GitHub Pages（最重要！）
- [ ] 访问：https://github.com/idjl/markdown-blog/settings/pages
- [ ] 在 `Build and deployment` 部分
- [ ] 在 `Source` 下拉菜单中选择 **`GitHub Actions`** ⚠️
- [ ] **不要**选择 "Deploy from a branch"
- [ ] 页面会自动保存

### 2. 配置 Actions 权限
- [ ] 访问：https://github.com/idjl/markdown-blog/settings/actions
- [ ] 滚动到 `Workflow permissions` 部分
- [ ] 选择 **`Read and write permissions`**
- [ ] 勾选 `Allow GitHub Actions to create and approve pull requests`
- [ ] 点击 `Save` 保存

### 3. 删除旧的 gh-pages 分支（如果存在）
- [ ] 访问：https://github.com/idjl/markdown-blog/branches
- [ ] 如果看到 `gh-pages` 分支，点击删除图标
- [ ] 这个分支是旧的部署方式创建的，会导致冲突

## ✅ 本地配置检查

### 3. 确认文件已修复
- [x] `.github/workflows/scheduled.yml` - 已更新为官方部署方式
- [x] `.github/workflows/deploy.yml` - 配置正确
- [x] `blog.config.js` - 仓库信息已更新为 `idjl/markdown-blog`
- [x] `package.json` - 仓库信息已更新
- [x] `.gitignore` - 已移除 `posts/` 目录
- [x] 删除了重复的 `blog.config.json`

### 4. 确认文章存在
- [ ] `posts/` 目录中至少有一篇 Markdown 文章
- [ ] 文章包含正确的 Front Matter（title, date, tags 等）

### 5. 本地测试（可选但推荐）
```bash
# 安装依赖
npm install

# 构建项目
npm run build

# 预览构建结果
npm run preview
```

## 🎯 部署步骤

### 6. 提交并推送代码
```bash
git add .
git commit -m "fix: update GitHub Actions deployment configuration"
git push origin main
```

### 7. 验证部署
- [ ] 访问 GitHub 仓库的 `Actions` 标签页
- [ ] 确认 `Deploy to GitHub Pages` 工作流正在运行
- [ ] 等待工作流完成（通常 2-5 分钟）
- [ ] 访问 https://idjl.github.io/markdown-blog/ 查看网站

## 🔧 如果部署失败

### 检查 Actions 日志
1. 进入 `Actions` 标签页
2. 点击失败的工作流运行
3. 查看详细错误信息

### 常见问题

**问题 1**: 权限错误 403
```
Solution: 确保完成了上面的步骤 1 和 2
```

**问题 2**: 找不到文章
```
Solution: 确保 posts/ 目录中有文章，且没有被 .gitignore 忽略
```

**问题 3**: 构建失败
```
Solution: 本地运行 npm run build 查看具体错误
```

## 📚 相关文档

- [GitHub Pages 详细配置指南](docs/GITHUB_PAGES_SETUP.md)
- [修复记录](docs/FIXES_APPLIED.md)
- [使用文档](docs/USAGE.md)
- [部署文档](docs/DEPLOYMENT.md)

## ✨ 完成后

部署成功后，你的博客将在以下地址可访问：
- **主站**: https://idjl.github.io/markdown-blog/
- **RSS 订阅**: https://idjl.github.io/markdown-blog/feed.xml
- **站点地图**: https://idjl.github.io/markdown-blog/sitemap.xml

## 🎉 下一步

- [ ] 自定义博客配置（编辑 `blog.config.js`）
- [ ] 添加更多文章到 `posts/` 目录
- [ ] 配置评论系统（utterances 或 giscus）
- [ ] 添加自定义域名（可选）
- [ ] 配置分析工具（Google Analytics 或百度统计）

---

**需要帮助？** 查看 [GitHub Issues](https://github.com/idjl/markdown-blog/issues) 或阅读详细文档。
