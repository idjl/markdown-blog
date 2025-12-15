# 🔍 GitHub Actions 部署问题排查指南

## 当前错误

```
/usr/bin/git push origin gh-pages
remote: Permission to idjl/markdown-blog.git denied to github-actions[bot].
fatal: unable to access 'https://github.com/idjl/markdown-blog.git/': The requested URL returned error: 403
Error: Action failed with "The process '/usr/bin/git' failed with exit code 128"
```

## 问题分析

这个错误表明工作流正在尝试推送到 `gh-pages` 分支，但这**不应该发生**在我们更新后的配置中。

可能的原因：

### 1. GitHub 仓库配置未更新 ⚠️

**最可能的原因**：GitHub Pages 的 Source 设置仍然是 `Deploy from a branch` 而不是 `GitHub Actions`。

**解决方案**：

1. 访问你的 GitHub 仓库：https://github.com/idjl/markdown-blog
2. 点击 `Settings` (设置)
3. 在左侧菜单找到 `Pages`
4. 在 `Build and deployment` 部分：
   - **Source**: 必须选择 `GitHub Actions` ⚠️
   - 如果显示的是 `Deploy from a branch`，这就是问题所在！
5. 保存更改

### 2. 旧的工作流运行仍在队列中

如果你之前触发了使用旧配置的工作流，它可能还在运行。

**解决方案**：

1. 访问 https://github.com/idjl/markdown-blog/actions
2. 取消所有正在运行的工作流
3. 等待几分钟
4. 重新触发工作流

### 3. 缓存的工作流定义

GitHub 可能缓存了旧的工作流定义。

**解决方案**：

1. 确认本地的 `.github/workflows/scheduled.yml` 文件是最新的
2. 提交并推送更改：
   ```bash
   git add .github/workflows/scheduled.yml
   git commit -m "fix: update scheduled workflow to use official GitHub Pages deployment"
   git push origin main
   ```
3. 等待几分钟让 GitHub 更新工作流定义

### 4. Actions 权限未正确配置

**解决方案**：

1. 访问 https://github.com/idjl/markdown-blog/settings/actions
2. 滚动到 `Workflow permissions`
3. 选择 `Read and write permissions`
4. 勾选 `Allow GitHub Actions to create and approve pull requests`
5. 点击 `Save`

## 完整的配置检查清单

### ✅ 步骤 1: 检查 GitHub Pages 设置

```
仓库 → Settings → Pages
└── Build and deployment
    └── Source: GitHub Actions ⚠️ (这是最重要的！)
```

### ✅ 步骤 2: 检查 Actions 权限

```
仓库 → Settings → Actions → General
└── Workflow permissions
    ├── ✓ Read and write permissions
    └── ✓ Allow GitHub Actions to create and approve pull requests
```

### ✅ 步骤 3: 检查工作流文件

确认 `.github/workflows/scheduled.yml` 包含：

```yaml
permissions:
  contents: read
  pages: write
  id-token: write
```

并且使用：
```yaml
- uses: actions/deploy-pages@v4
```

而**不是**：
```yaml
- uses: peaceiris/actions-gh-pages@v4
```

### ✅ 步骤 4: 清理并重新部署

```bash
# 1. 确保所有更改已提交
git status

# 2. 如果有未提交的更改
git add .
git commit -m "fix: update GitHub Actions configuration"

# 3. 推送到 GitHub
git push origin main

# 4. 访问 Actions 页面
# https://github.com/idjl/markdown-blog/actions

# 5. 如果有失败的运行，点击 "Re-run all jobs"
```

## 验证配置

### 检查 1: Pages 设置

访问：https://github.com/idjl/markdown-blog/settings/pages

应该看到：
```
Build and deployment
Source: GitHub Actions
```

### 检查 2: 工作流文件

运行以下命令检查本地文件：

```bash
# 检查 scheduled.yml
cat .github/workflows/scheduled.yml | grep -A 5 "Deploy to GitHub Pages"
```

应该看到：
```yaml
- name: Deploy to GitHub Pages
  id: deployment
  uses: actions/deploy-pages@v4
```

### 检查 3: Actions 日志

1. 访问 https://github.com/idjl/markdown-blog/actions
2. 点击最新的工作流运行
3. 查看 "Deploy to GitHub Pages" 步骤
4. 应该看到使用 `actions/deploy-pages@v4` 而不是 git push

## 如果问题仍然存在

### 方案 A: 删除 gh-pages 分支（如果存在）

旧的部署方式会创建 `gh-pages` 分支，这可能导致冲突。

```bash
# 在 GitHub 网页上删除 gh-pages 分支
# 仓库 → Branches → 找到 gh-pages → 点击删除图标
```

### 方案 B: 使用 Personal Access Token

如果上述方法都不起作用，可以使用个人访问令牌：

1. **创建 Token**
   - 访问 https://github.com/settings/tokens
   - 点击 `Generate new token (classic)`
   - 勾选 `repo` 权限
   - 生成并复制 token

2. **添加到仓库 Secrets**
   - 访问 https://github.com/idjl/markdown-blog/settings/secrets/actions
   - 点击 `New repository secret`
   - Name: `DEPLOY_TOKEN`
   - Value: 粘贴 token
   - 保存

3. **创建备用工作流**

创建 `.github/workflows/deploy-with-token.yml`：

```yaml
name: Deploy with Token

on:
  workflow_dispatch:

permissions:
  contents: write

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install and Build
        run: |
          npm ci
          npm run build
      
      - name: Deploy
        uses: peaceiris/actions-gh-pages@v4
        with:
          personal_token: ${{ secrets.DEPLOY_TOKEN }}
          publish_dir: ./dist
```

## 联系支持

如果以上所有方法都不起作用，请：

1. 在 GitHub Issues 中创建问题：https://github.com/idjl/markdown-blog/issues
2. 包含以下信息：
   - Actions 运行的完整日志
   - Pages 设置的截图
   - Actions 权限设置的截图

## 快速诊断命令

运行这些命令来诊断问题：

```bash
# 检查当前分支
git branch

# 检查远程分支
git branch -r

# 检查工作流文件
cat .github/workflows/scheduled.yml

# 检查最近的提交
git log --oneline -5

# 检查 git 状态
git status
```

## 成功的标志

当配置正确时，你应该看到：

1. ✅ Actions 页面显示绿色的勾号
2. ✅ 部署步骤使用 `actions/deploy-pages@v4`
3. ✅ 没有提到 `gh-pages` 分支
4. ✅ 网站可以访问：https://idjl.github.io/markdown-blog/

---

**记住最重要的一步**：在 GitHub 仓库的 Settings → Pages 中，Source 必须设置为 `GitHub Actions`！
