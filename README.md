# Markdown Blog Generator

A modern Markdown static blog generator.

A modern static blog system built with Markdown, TypeScript, and Vite. Features include GitHub Pages deployment, syntax highlighting, responsive design, and more.

## Features

### Core Features
- Full Markdown support (tables, task lists, code blocks, etc.)
- Responsive design for desktop, tablet, and mobile
- Theme switching (light/dark with system preference)
- Client‑side full‑text search
- Comment systems: Utterances and Giscus
- Syntax highlighting via Prism.js
- Mobile‑friendly interactions

### SEO & Performance
- SEO‑ready: complete meta tags, Open Graph, Twitter Card
- RSS 2.0 feed generation
- XML sitemap generation
- Fast builds powered by Vite
- Pure static HTML for fast loading

### Deployment & Management
- GitHub Actions for GitHub Pages
- Custom domain support
- Clear, maintainable project structure
- Hot reload and file watching in development

## Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/idjl/markdown-blog.git
cd markdown-blog

# Install dependencies
npm install

# Start development server
npm run dev
```

### Writing Posts

Create your posts in the `posts/` directory with `.md` extension:

```markdown
---
title: "My First Post"
date: 2024-01-01
tags: ["blog", "markdown"]
category: "tech"
description: "This is my first blog post"
---

# Hello World

This is my first blog post written in Markdown!
```

### Building

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

### Deployment

1. Push to GitHub
2. Configure GitHub Pages in repository settings (see [detailed setup guide](docs/GITHUB_PAGES_SETUP.md))
3. GitHub Actions will automatically deploy your blog

**Important**: Make sure to configure GitHub Pages source to "GitHub Actions" in your repository settings. See [docs/GITHUB_PAGES_SETUP.md](docs/GITHUB_PAGES_SETUP.md) for detailed instructions.

## Configuration

Edit `blog.config.js` to customize your blog:

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

## Directory Structure

```
markdown-blog/
├── src/                    # Source code
│   ├── core/              # Core functionality
│   ├── utils/             # Utility functions
│   ├── plugins/           # Plugins
│   ├── templates/         # HTML templates
│   └── styles/            # Styles
├── posts/                 # Blog posts (Markdown)
├── public/                # Static assets
├── scripts/               # Build scripts
├── dist/                  # Build output
└── .github/               # GitHub Actions
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run clean` - Clean build directory
- `npm run lint` - Lint code
- `npm run lint:fix` - Fix linting issues
- `npm run format` - Format code
- `npm run type-check` - Type check
- `npm run test` - Run tests
- `npm run deploy` - Deploy to GitHub Pages

## Customization

### Themes

Edit `src/styles/theme.css` to customize colors and styles.

### Templates

Modify HTML templates in `src/templates/` to change the layout.

### Plugins

Extend functionality by adding plugins to `src/plugins/`.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Vite](https://vitejs.dev/) for the amazing build tool
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS framework
- [markdown-it](https://github.com/markdown-it/markdown-it) for Markdown parsing
- [Prism.js](https://prismjs.com/) for syntax highlighting