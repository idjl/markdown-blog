# CSS 样式丢失问题修复指南

## 问题原因

你的网站部署在 `https://idjl.github.io/markdown-blog/`（有子路径），但资源路径配置为根路径，导致浏览器无法找到 CSS 和 JS 文件。

## 已完成的修复

### 1. 更新 vite.config.ts ✅

已添加 `base: '/markdown-blog/'` 配置：

```typescript
export default defineConfig({
  base: '/markdown-blog/',  // ← 已添加
  root: 'src',
  // ...
});
```

## 需要完成的步骤

### 步骤 1：重新构建项目

```bash
# 清理旧的构建文件
npm run clean

# 重新构建
npm run build
```

### 步骤 2：提交并推送

```bash
git add .
git commit -m "fix: add base path for GitHub Pages deployment"
git push origin main
```

### 步骤 3：等待部署完成

1. 访问：`https://github.com/idjl/markdown-blog/actions`
2. 等待工作流完成（2-5 分钟）
3. 看到绿色勾号 ✅ 后继续

### 步骤 4：清除浏览器缓存并验证

1. 打开浏览器
2. 按 `Ctrl + Shift + R`（Windows）或 `Cmd + Shift + R`（Mac）强制刷新
3. 访问：`https://idjl.github.io/markdown-blog/`
4. 检查样式是否正常显示

## 验证方法

### 检查 1：查看浏览器控制台

1. 按 `F12` 打开开发者工具
2. 切换到 `Console` 标签
3. 刷新页面
4. **不应该看到** 404 错误（找不到 CSS/JS 文件）

### 检查 2：查看 Network 标签

1. 在开发者工具中切换到 `Network` 标签
2. 刷新页面
3. 查找 CSS 和 JS 文件
4. 确认它们的路径是：
   - ✅ `/markdown-blog/assets/css/main.css`
   - ✅ `/markdown-blog/assets/js/main.js`
   - ❌ 不应该是 `/assets/css/main.css`（缺少 /markdown-blog/）

### 检查 3：查看页面源代码

1. 在页面上右键点击
2. 选择"查看页面源代码"
3. 查找 `<link>` 和 `<script>` 标签
4. 确认路径包含 `/markdown-blog/` 前缀

## 如果问题仍然存在

### 方案 A：检查 HTML 模板

如果你的项目使用自定义 HTML 模板，需要确保它们使用相对路径或正确的 base 路径。

查找文件：`src/templates/*.html`

确保资源引用使用相对路径：
```html
<!-- 正确 -->
<link rel="stylesheet" href="./assets/css/main.css">
<script src="./assets/js/main.js"></script>

<!-- 或使用绝对路径 -->
<link rel="stylesheet" href="/markdown-blog/assets/css/main.css">
<script src="/markdown-blog/assets/js/main.js"></script>
```

### 方案 B：检查构建输出

查看 `dist/` 目录中的 HTML 文件，确认资源路径是否正确：

```bash
# Windows
type dist\\index.html | findstr "href\\|src"

# 或者直接打开文件查看
```

### 方案 C：使用用户/组织站点（无子路径）

如果你想避免子路径问题，可以：

1. 将仓库重命名为：`idjl.github.io`
2. 更新 `vite.config.ts`：
   ```typescript
   export default defineConfig({
     base: '/',  // 改为根路径
     // ...
   });
   ```
3. 更新 `blog.config.js` 中的 URL：
   ```javascript
   url: 'https://idjl.github.io/',
   baseUrl: 'https://idjl.github.io/',
   ```

## 常见问题

### Q: 为什么需要 base 路径？

A: GitHub Pages 项目站点部署在 `username.github.io/repo-name/`，所有资源都需要包含 `/repo-name/` 前缀。

### Q: 本地开发时会有问题吗？

A: 不会。Vite 开发服务器会自动处理 base 路径。

### Q: 可以使用自定义域名吗？

A: 可以！使用自定义域名后，可以将 base 改为 `'/'`，因为不再有子路径。

## 快速检查清单

- [ ] `vite.config.ts` 中添加了 `base: '/markdown-blog/'`
- [ ] 运行了 `npm run clean` 和 `npm run build`
- [ ] 提交并推送了代码
- [ ] GitHub Actions 部署成功（绿色勾号）
- [ ] 强制刷新浏览器（Ctrl + Shift + R）
- [ ] 浏览器控制台没有 404 错误
- [ ] CSS 样式正常显示

## 成功标志

当修复成功后，你应该看到：

✅ 网站有正常的样式和布局
✅ 浏览器控制台没有错误
✅ Network 标签显示所有资源都成功加载（状态码 200）
✅ 页面看起来美观且功能正常

---

**记住**：每次修改配置后，都需要重新构建并部署！
