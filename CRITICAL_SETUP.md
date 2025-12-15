# ⚠️ 关键配置步骤 - 必须完成！

## 🚨 你的错误原因

错误信息：
```
/usr/bin/git push origin gh-pages
remote: Permission to idjl/markdown-blog.git denied to github-actions[bot].
```

**根本原因**：GitHub Pages 的 Source 设置不正确！

## ✅ 解决方案（5分钟完成）

### 第 1 步：访问 GitHub Pages 设置

1. 打开浏览器，访问：
   ```
   https://github.com/idjl/markdown-blog/settings/pages
   ```

2. 或者手动导航：
   - 打开你的仓库：https://github.com/idjl/markdown-blog
   - 点击顶部的 `Settings` (设置) 标签
   - 在左侧菜单中找到并点击 `Pages`

### 第 2 步：更改 Source 设置 ⚠️ 最重要！

在 `Build and deployment` 部分：

**当前设置（错误的）**：
```
Source: Deploy from a branch
Branch: gh-pages / (root)
```

**必须改为（正确的）**：
```
Source: GitHub Actions
```

**操作步骤**：
1. 找到 `Source` 下拉菜单
2. 点击下拉菜单
3. 选择 `GitHub Actions`
4. 页面会自动保存

### 第 3 步：配置 Actions 权限

1. 访问：
   ```
   https://github.com/idjl/markdown-blog/settings/actions
   ```

2. 或者手动导航：
   - 在仓库的 `Settings` 页面
   - 左侧菜单找到 `Actions` → `General`

3. 滚动到 `Workflow permissions` 部分

4. 选择：
   - ✅ `Read and write permissions`

5. 勾选：
   - ✅ `Allow GitHub Actions to create and approve pull requests`

6. 点击 `Save` 按钮

### 第 4 步：清理旧的部署

如果你的仓库中存在 `gh-pages` 分支，需要删除它：

1. 访问：
   ```
   https://github.com/idjl/markdown-blog/branches
   ```

2. 找到 `gh-pages` 分支（如果存在）

3. 点击右侧的垃圾桶图标删除

### 第 5 步：重新部署

1. 提交本地更改：
   ```bash
   git add .
   git commit -m "fix: remove old deployment scripts and update documentation"
   git push origin main
   ```

2. 访问 Actions 页面：
   ```
   https://github.com/idjl/markdown-blog/actions
   ```

3. 等待工作流完成（约 2-5 分钟）

4. 访问你的网站：
   ```
   https://idjl.github.io/markdown-blog/
   ```

## 🎯 验证配置是否正确

### 检查点 1：Pages 设置

访问：https://github.com/idjl/markdown-blog/settings/pages

应该看到：
```
✅ Your site is live at https://idjl.github.io/markdown-blog/

Build and deployment
Source: GitHub Actions
```

### 检查点 2：Actions 运行

访问：https://github.com/idjl/markdown-blog/actions

应该看到：
- ✅ 绿色的勾号（表示成功）
- ✅ 工作流名称：`Deploy to GitHub Pages`
- ✅ 没有红色的 X（表示失败）

### 检查点 3：部署日志

点击最新的工作流运行，查看日志：

**正确的日志应该包含**：
```
✅ Setup Pages
✅ Build site
✅ Upload artifact
✅ Deploy to GitHub Pages (使用 actions/deploy-pages@v4)
```

**不应该包含**：
```
❌ git push origin gh-pages
❌ peaceiris/actions-gh-pages
```

## 🔍 如果还是失败

### 情况 1：仍然看到 "git push origin gh-pages"

**原因**：GitHub 缓存了旧的工作流定义

**解决**：
1. 取消所有正在运行的工作流
2. 等待 5-10 分钟
3. 手动触发新的工作流：
   - 访问 Actions 页面
   - 选择 `Deploy to GitHub Pages` 工作流
   - 点击 `Run workflow` 按钮
   - 选择 `main` 分支
   - 点击绿色的 `Run workflow` 按钮

### 情况 2：权限错误

**原因**：Actions 权限未正确配置

**解决**：
1. 再次检查 Settings → Actions → General
2. 确保选择了 `Read and write permissions`
3. 确保勾选了 `Allow GitHub Actions to create and approve pull requests`
4. 点击 `Save`
5. 重新运行工作流

### 情况 3：Pages 设置不可用

**原因**：仓库可能是私有的

**解决**：
1. 访问 Settings → General
2. 滚动到底部的 `Danger Zone`
3. 确认仓库是 `Public`
4. 如果是 `Private`，需要 GitHub Pro 账户才能使用 Pages

## 📞 需要帮助？

如果完成以上所有步骤后仍然失败：

1. **截图以下内容**：
   - Settings → Pages 页面
   - Settings → Actions → General 页面（Workflow permissions 部分）
   - Actions 页面的失败日志

2. **创建 Issue**：
   - 访问：https://github.com/idjl/markdown-blog/issues/new
   - 标题：`GitHub Actions deployment failed`
   - 附上截图和错误日志

## ✨ 成功标志

当一切配置正确后，你会看到：

1. ✅ Actions 页面全是绿色勾号
2. ✅ Pages 设置显示 "Your site is live at..."
3. ✅ 可以访问 https://idjl.github.io/markdown-blog/
4. ✅ 网站显示你的博客内容

---

**记住**：最关键的一步是在 GitHub 仓库的 Settings → Pages 中，将 Source 改为 `GitHub Actions`！

这是 90% 的部署问题的根本原因。
