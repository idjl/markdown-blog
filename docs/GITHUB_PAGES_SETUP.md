# GitHub Pages 部署配置指南

## 问题说明

如果遇到 GitHub Actions 部署失败，错误信息为：
```
remote: Permission to idjl/markdown-blog.git denied to github-actions[bot].
fatal: unable to access 'https://github.com/idjl/markdown-blog.git/': The requested URL returned error: 403
```

## 解决方案

### 方法一：使用 GitHub Pages 官方部署方式（推荐）

这是我们当前使用的方式，需要在 GitHub 仓库中进行以下配置：

1. **进入仓库设置**
   - 打开你的 GitHub 仓库
   - 点击 `Settings` (设置)

2. **配置 GitHub Pages**
   - 在左侧菜单找到 `Pages`
   - 在 `Source` (来源) 下拉菜单中选择 `GitHub Actions`
   - 保存设置

3. **配置 Actions 权限**
   - 在左侧菜单找到 `Actions` → `General`
   - 滚动到 `Workflow permissions` (工作流权限)
   - 选择 `Read and write permissions` (读写权限)
   - 勾选 `Allow GitHub Actions to create and approve pull requests`
   - 点击 `Save` 保存

### 方法二：使用 Personal Access Token（备选）

如果方法一不起作用，可以使用个人访问令牌：

1. **创建 Personal Access Token**
   - 访问 GitHub Settings → Developer settings → Personal access tokens → Tokens (classic)
   - 点击 `Generate new token (classic)`
   - 设置名称，如 `BLOG_DEPLOY_TOKEN`
   - 勾选 `repo` 权限
   - 生成并复制 token

2. **添加到仓库 Secrets**
   - 进入仓库 Settings → Secrets and variables → Actions
   - 点击 `New repository secret`
   - Name: `PERSONAL_ACCESS_TOKEN`
   - Value: 粘贴刚才复制的 token
   - 保存

3. **修改 workflow 文件**
   - 将 `github_token: ${{ secrets.GITHUB_TOKEN }}` 
   - 改为 `github_token: ${{ secrets.PERSONAL_ACCESS_TOKEN }}`

## 当前工作流说明

项目包含三个 GitHub Actions 工作流：

### 1. deploy.yml - 主部署工作流
- **触发条件**: 推送到 main/master 分支
- **功能**: 构建并部署到 GitHub Pages
- **使用方式**: 官方 GitHub Pages Actions

### 2. scheduled.yml - 定时构建工作流
- **触发条件**: 每天凌晨 2 点自动运行，或手动触发
- **功能**: 定期重新构建和部署网站
- **使用方式**: 与 deploy.yml 相同的官方方式

### 3. test.yml - 测试工作流
- **触发条件**: 推送或 PR 到 main/master/develop 分支
- **功能**: 运行代码检查、类型检查和测试
- **不涉及部署**

## 验证部署

部署成功后，你可以通过以下地址访问博客：
- https://idjl.github.io/markdown-blog/

## 常见问题

### Q: 为什么需要 `pages: write` 权限？
A: GitHub Pages 的官方部署方式需要这个权限来上传构建产物。

### Q: 为什么需要 `id-token: write` 权限？
A: 这是 GitHub Pages 新的部署方式所需的 OIDC 令牌权限。

### Q: 可以使用自定义域名吗？
A: 可以，在仓库 Settings → Pages 中配置自定义域名，并在 DNS 中添加 CNAME 记录。

### Q: 如何手动触发部署？
A: 进入 Actions 标签页，选择 `Scheduled Build` 工作流，点击 `Run workflow` 按钮。

## 更多信息

- [GitHub Pages 官方文档](https://docs.github.com/en/pages)
- [GitHub Actions 文档](https://docs.github.com/en/actions)
- [actions/deploy-pages 文档](https://github.com/actions/deploy-pages)
