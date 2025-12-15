---
title: "你好，世界"
date: 2025-11-21
tags: ["入门", "示例"]
category: "随笔"
author: "你自己"
description: "第一篇文章，测试生成器。"
---

# 你好，世界

[[toc]]

这是你的第一篇文章，用来验证博客生成器是否正常工作。你可以使用标准 Markdown 语法、代码块、任务列表、提示块等。

## 代码示例

```ts
function hello(name: string) {
  return `你好，${name}!`;
}

console.log(hello('世界'));
```

## 自定义提示块

::: tip 使用小贴士
你可以用 `::: tip 标题` 开始，`:::` 结束，生成一个带样式的提示块。
:::

::: warning 注意事项
这是一个警告块，用来提醒重要信息。
:::

::: danger 危险操作
这里可以描述需要谨慎执行的操作。
:::

## 任务列表示例

- [x] 安装依赖
- [x] 生成静态文件
- [ ] 发布到生产环境

写完文章后，运行 `npm run build` 生成静态文件，然后用 `npm run preview` 本地预览。