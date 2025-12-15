---
title: "Building a Static Blog Generator with TypeScript"
date: 2024-01-20
categories: ["tutorial", "typescript"]
tags: ["static-site-generator", "typescript", "nodejs", "markdown"]
author: "Your Name"
description: "Learn how to build a powerful static blog generator using TypeScript and modern web technologies"
---

# Building a Static Blog Generator with TypeScript

In this tutorial, I'll walk you through building a powerful static blog generator using TypeScript, Node.js, and modern web technologies.

## Why Build a Static Blog Generator?

Static site generators offer several advantages:

- **Speed**: Static files load incredibly fast
- **Security**: No database or server-side vulnerabilities
- **Scalability**: Easily handle traffic spikes
- **Version Control**: Your content lives in Git
- **Flexibility**: Complete control over the output

## Core Technologies

### Markdown Processing

We use [markdown-it](https://github.com/markdown-it/markdown-it) as our core parser with several plugins:

```typescript
import MarkdownIt from 'markdown-it';
import anchor from 'markdown-it-anchor';
import table from 'markdown-it-table';
import taskLists from 'markdown-it-task-lists';

const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true
});

md.use(anchor);
md.use(table);
md.use(taskLists);
```

### Template Engine

Our custom template engine supports:

- Variable substitution: `{{title}}`
- Conditionals: `{{#if featured}}...{{/if}}`
- Loops: `{{#each posts}}...{{/each}}`

```typescript
class TemplateEngine {
  render(template: string, data: any): string {
    // Variable substitution
    template = template.replace(/\{\{(\w+)\}\}/g, (match, key) => {
      return data[key] || '';
    });
    
    // Conditional rendering
    template = template.replace(/\{\{#if (\w+)\}\}(.*?)\{\{\/if\}\}/gs, (match, condition, content) => {
      return data[condition] ? content : '';
    });
    
    return template;
  }
}
```

### Front Matter Processing

We parse YAML front matter using [gray-matter](https://github.com/jonschlinkert/gray-matter):

```typescript
import matter from 'gray-matter';

interface PostData {
  title: string;
  date: string;
  categories: string[];
  tags: string[];
  author: string;
  description: string;
  content: string;
}

function parsePost(content: string): PostData {
  const { data, content: markdown } = matter(content);
  return {
    ...data,
    content: markdown
  };
}
```

## Project Structure

```
src/
├── core/
│   ├── static-generator.ts    # Main generator class
│   ├── template-engine.ts     # Template processing
│   └── data-processor.ts      # Post data processing
├── plugins/
│   ├── search.ts             # Search functionality
│   ├── comments.ts           # Comment system
│   └── syntax-highlight.ts   # Code highlighting
├── templates/
│   ├── layout.html           # Base layout
│   ├── index.html            # Homepage
│   ├── post.html             # Article page
│   └── ...                   # Other templates
└── commands/
    ├── build.ts              # Build command
    ├── dev.ts                # Development server
    └── preview.ts            # Preview server
```

## Key Features Implementation

### 1. Responsive Design

Our templates use Tailwind CSS for responsive design:

```html
<!-- Mobile-first responsive navigation -->
<nav class="bg-white dark:bg-gray-800 shadow-lg">
  <div class="max-w-6xl mx-auto px-4">
    <div class="flex justify-between items-center py-4">
      <!-- Logo and navigation -->
      <div class="hidden md:flex space-x-6">
        <a href="/" class="text-gray-700 dark:text-gray-300 hover:text-blue-600">Home</a>
        <a href="/categories" class="text-gray-700 dark:text-gray-300 hover:text-blue-600">Categories</a>
        <a href="/tags" class="text-gray-700 dark:text-gray-300 hover:text-blue-600">Tags</a>
      </div>
      
      <!-- Mobile menu button -->
      <button id="mobile-menu-button" class="md:hidden">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
        </svg>
      </button>
    </div>
  </div>
</nav>
```

### 2. Dark Mode Support

We implement theme switching with CSS variables:

```javascript
// Theme switching logic
function toggleTheme() {
  const html = document.documentElement;
  const currentTheme = html.classList.contains('dark') ? 'dark' : 'light';
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  
  html.classList.remove(currentTheme);
  html.classList.add(newTheme);
  localStorage.setItem('theme', newTheme);
}

// Initialize theme
const savedTheme = localStorage.getItem('theme') || 'light';
document.documentElement.classList.add(savedTheme);
```

### 3. Search Functionality

We generate a search index and implement client-side search:

```typescript
class SearchPlugin {
  generateIndex(posts: Post[]): SearchIndex {
    return posts.map(post => ({
      title: post.title,
      content: post.content.substring(0, 200),
      url: post.url,
      categories: post.categories,
      tags: post.tags
    }));
  }
}

// Client-side search implementation
function search(query: string, index: SearchIndex): SearchResult[] {
  const results = index.filter(item => 
    item.title.toLowerCase().includes(query.toLowerCase()) ||
    item.content.toLowerCase().includes(query.toLowerCase()) ||
    item.categories.some(cat => cat.toLowerCase().includes(query.toLowerCase())) ||
    item.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
  );
  
  return results.slice(0, 10); // Return top 10 results
}
```

### 4. RSS Feed Generation

We generate RSS 2.0 feeds:

```typescript
function generateRSS(posts: Post[]): string {
  const items = posts.map(post => `
    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${config.siteUrl}${post.url}</link>
      <guid>${config.siteUrl}${post.url}</guid>
      <pubDate>${new Date(post.date).toUTCString()}</pubDate>
      <description>${escapeXml(post.description)}</description>
    </item>
  `).join('');
  
  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>${escapeXml(config.title)}</title>
    <link>${config.siteUrl}</link>
    <description>${escapeXml(config.description)}</description>
    <language>en-us</language>
    ${items}
  </channel>
</rss>`;
}
```

## Deployment Options

### GitHub Pages

The easiest deployment option is GitHub Pages:

1. Create a `.github/workflows/deploy.yml` file
2. Set up automated builds on push to main branch
3. Configure custom domain with CNAME file

```yaml
name: Deploy to GitHub Pages
on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm install
      - run: npm run build
      - uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

### Other Platforms

The static output can be deployed to:

- **Netlify**: Drag and drop the `dist` folder
- **Vercel**: Connect your GitHub repository
- **Firebase Hosting**: Use the Firebase CLI
- **AWS S3**: Upload to S3 bucket with CloudFront

## Conclusion

Building a static blog generator is a great way to learn about:

- File system operations
- Template processing
- Markdown parsing
- Build automation
- Deployment strategies

The complete source code and documentation are available in this repository. Feel free to fork, modify, and make it your own!

Happy blogging! 🚀