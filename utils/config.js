"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadConfig = loadConfig;
exports.mergeConfig = mergeConfig;
const path_1 = __importDefault(require("path"));
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);
function loadConfig() {
    try {
        // Try to load from project root
        const configPath = path_1.default.resolve(process.cwd(), 'blog.config.js');
        const config = require(configPath);
        return config.default || config;
    }
    catch (error) {
        console.warn('Warning: blog.config.js not found, using default configuration');
        return getDefaultConfig();
    }
}
function getDefaultConfig() {
    return {
        title: 'Markdown Blog',
        description: 'A modern static blog system built with Markdown',
        author: 'Anonymous',
        url: 'http://localhost:3000',
        baseUrl: '/',
        language: 'zh-CN',
        timezone: 'Asia/Shanghai',
        theme: {
            primary: '#3b82f6',
            secondary: '#64748b',
            accent: '#8b5cf6',
            background: '#ffffff',
            surface: '#f8fafc',
            text: '#1f2937',
            textSecondary: '#6b7280',
        },
        darkTheme: {
            primary: '#60a5fa',
            secondary: '#94a3b8',
            accent: '#a78bfa',
            background: '#0f172a',
            surface: '#1e293b',
            text: '#f9fafb',
            textSecondary: '#d1d5db',
        },
        social: {
            rss: true,
        },
        posts: {
            dir: 'posts',
            perPage: 10,
            excerptLength: 200,
            dateFormat: 'YYYY-MM-DD',
            showDate: true,
            showAuthor: true,
            showTags: true,
            showCategories: true,
        },
        comments: {
            provider: 'utterances',
            repo: '',
            issueTerm: 'pathname',
            theme: 'github-light',
            darkTheme: 'github-dark',
        },
        search: {
            enabled: true,
            placeholder: '搜索文章...',
            maxResults: 10,
        },
        analytics: {},
        seo: {
            keywords: ['blog', 'markdown'],
            author: 'Anonymous',
            twitterCard: 'summary_large_image',
            ogImage: '/assets/og-image.png',
        },
        build: {
            outputDir: 'dist',
            assetsDir: 'assets',
            templatesDir: 'src/templates',
            clean: true,
            minify: true,
            sourcemap: false,
        },
        dev: {
            port: 3000,
            host: 'localhost',
            open: true,
            hot: true,
        },
        plugins: {
            syntaxHighlight: {
                enabled: true,
                theme: 'github',
                darkTheme: 'github-dark',
            },
            rss: {
                enabled: true,
                title: 'Markdown Blog RSS',
                description: 'Latest posts from Markdown Blog',
                language: 'zh-CN',
                ttl: 60,
            },
            sitemap: {
                enabled: true,
                hostname: 'http://localhost:3000',
                changefreq: 'weekly',
                priority: 0.8,
            },
        },
    };
}
function mergeConfig(base, overrides) {
    return {
        ...base,
        ...overrides,
        theme: { ...base.theme, ...overrides.theme },
        darkTheme: { ...base.darkTheme, ...overrides.darkTheme },
        social: { ...base.social, ...overrides.social },
        posts: { ...base.posts, ...overrides.posts },
        comments: { ...base.comments, ...overrides.comments },
        search: { ...base.search, ...overrides.search },
        analytics: { ...base.analytics, ...overrides.analytics },
        seo: { ...base.seo, ...overrides.seo },
        build: { ...base.build, ...overrides.build },
        dev: { ...base.dev, ...overrides.dev },
        plugins: { ...base.plugins, ...overrides.plugins },
    };
}
//# sourceMappingURL=config.js.map