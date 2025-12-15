"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MarkdownParser = void 0;
const gray_matter_1 = __importDefault(require("gray-matter"));
const markdown_it_1 = __importDefault(require("markdown-it"));
const markdown_it_anchor_1 = __importDefault(require("markdown-it-anchor"));
const markdown_it_table_of_contents_1 = __importDefault(require("markdown-it-table-of-contents"));
const markdown_it_task_lists_1 = __importDefault(require("markdown-it-task-lists"));
const markdown_it_footnote_1 = __importDefault(require("markdown-it-footnote"));
const markdown_it_mark_1 = __importDefault(require("markdown-it-mark"));
const markdown_it_ins_1 = __importDefault(require("markdown-it-ins"));
const markdown_it_sub_1 = __importDefault(require("markdown-it-sub"));
const markdown_it_sup_1 = __importDefault(require("markdown-it-sup"));
const markdown_it_abbr_1 = __importDefault(require("markdown-it-abbr"));
const markdown_it_deflist_1 = __importDefault(require("markdown-it-deflist"));
const markdown_it_container_1 = __importDefault(require("markdown-it-container"));
const markdown_it_emoji_1 = __importDefault(require("markdown-it-emoji"));
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = __importDefault(require("path"));
const dayjs_1 = __importDefault(require("dayjs"));
class MarkdownParser {
    constructor() {
        this.md = new markdown_it_1.default({
            html: true,
            linkify: true,
            typographer: true,
            breaks: false,
        });
        this.setupPlugins();
    }
    setupPlugins() {
        // 锚点插件
        this.md.use(markdown_it_anchor_1.default, {
            permalink: markdown_it_anchor_1.default.permalink.headerLink(),
            permalinkBefore: true,
            permalinkClass: 'header-anchor',
            permalinkSymbol: '#',
            slugify: (str) => str
                .toLowerCase()
                .replace(/[^\w\s-]/g, '')
                .replace(/\s+/g, '-'),
        });
        // 目录插件
        this.md.use(markdown_it_table_of_contents_1.default, {
            includeLevel: [2, 3, 4],
            containerClass: 'table-of-contents',
            markerPattern: /^\[\[toc\]\]/im,
            listType: 'ul',
            slugify: (str) => str
                .toLowerCase()
                .replace(/[^\w\s-]/g, '')
                .replace(/\s+/g, '-'),
        });
        // 任务列表
        this.md.use(markdown_it_task_lists_1.default, {
            enabled: true,
            label: true,
            labelAfter: true,
        });
        // 脚注
        this.md.use(markdown_it_footnote_1.default);
        // 标记
        this.md.use(markdown_it_mark_1.default);
        // 插入
        this.md.use(markdown_it_ins_1.default);
        // 上标下标
        this.md.use(markdown_it_sub_1.default);
        this.md.use(markdown_it_sup_1.default);
        // 缩写
        this.md.use(markdown_it_abbr_1.default);
        // 定义列表
        this.md.use(markdown_it_deflist_1.default);
        // 容器
        this.md.use(markdown_it_container_1.default, 'tip', {
            render: (tokens, idx) => {
                const m = tokens[idx].info.trim().match(/^tip\\s+(.*)$/);
                if (tokens[idx].nesting === 1) {
                    return `<div class="custom-block tip"><p class="custom-block-title">${m ? m[1] : '提示'}</p>\n`;
                }
                else {
                    return '</div>\n';
                }
            },
        });
        this.md.use(markdown_it_container_1.default, 'warning', {
            render: (tokens, idx) => {
                const m = tokens[idx].info.trim().match(/^warning\\s+(.*)$/);
                if (tokens[idx].nesting === 1) {
                    return `<div class="custom-block warning"><p class="custom-block-title">${m ? m[1] : '警告'}</p>\n`;
                }
                else {
                    return '</div>\n';
                }
            },
        });
        this.md.use(markdown_it_container_1.default, 'danger', {
            render: (tokens, idx) => {
                const m = tokens[idx].info.trim().match(/^danger\\s+(.*)$/);
                if (tokens[idx].nesting === 1) {
                    return `<div class="custom-block danger"><p class="custom-block-title">${m ? m[1] : '危险'}</p>\n`;
                }
                else {
                    return '</div>\n';
                }
            },
        });
        // 表情符号
        this.md.use(markdown_it_emoji_1.default);
    }
    async parse(filePath) {
        const content = await fs_extra_1.default.readFile(filePath, 'utf-8');
        const { data, content: markdownContent } = (0, gray_matter_1.default)(content);
        const frontMatter = this.normalizeFrontMatter(data);
        const htmlContent = this.md.render(markdownContent);
        const excerpt = this.generateExcerpt(htmlContent);
        const wordCount = this.countWords(markdownContent);
        const readingTime = this.calculateReadingTime(wordCount);
        const slug = this.generateSlug(frontMatter.title, filePath);
        const url = `/posts/${slug}/`;
        return {
            title: frontMatter.title,
            slug,
            content: htmlContent,
            excerpt,
            date: new Date(frontMatter.date),
            updated: frontMatter.updated ? new Date(frontMatter.updated) : undefined,
            author: frontMatter.author,
            tags: Array.isArray(frontMatter.tags)
                ? frontMatter.tags
                : frontMatter.tags
                    ? [frontMatter.tags]
                    : [],
            category: frontMatter.category,
            description: frontMatter.description,
            coverImage: frontMatter.coverImage,
            draft: frontMatter.draft || false,
            readingTime,
            wordCount,
            filePath,
            url,
        };
    }
    normalizeFrontMatter(data) {
        const normalized = { ...data };
        // 标准化日期
        if (data.date) {
            normalized.date = (0, dayjs_1.default)(data.date).toDate();
        }
        else {
            normalized.date = new Date();
        }
        // 标准化更新日期
        if (data.updated) {
            normalized.updated = (0, dayjs_1.default)(data.updated).toDate();
        }
        // 标准化标签
        if (data.tags) {
            if (typeof data.tags === 'string') {
                normalized.tags = data.tags.split(',').map((tag) => tag.trim());
            }
            else if (Array.isArray(data.tags)) {
                normalized.tags = data.tags.map((tag) => tag.trim());
            }
        }
        else {
            normalized.tags = [];
        }
        // 标准化作者
        if (!data.author) {
            normalized.author = 'Anonymous';
        }
        return normalized;
    }
    generateExcerpt(html, maxLength = 200) {
        // 移除HTML标签
        const text = html.replace(/<[^>]*>/g, '');
        if (text.length <= maxLength) {
            return text;
        }
        // 截取前maxLength个字符，并在最后一个空格处截断
        const excerpt = text.substring(0, maxLength);
        const lastSpace = excerpt.lastIndexOf(' ');
        if (lastSpace > 0) {
            return excerpt.substring(0, lastSpace) + '...';
        }
        return excerpt + '...';
    }
    countWords(content) {
        const text = content.replace(/<[^>]*>/g, '');
        return text.trim().split(/\s+/).length;
    }
    calculateReadingTime(wordCount) {
        // 假设平均阅读速度为每分钟200字
        return Math.ceil(wordCount / 200);
    }
    generateSlug(title, filePath) {
        // 如果标题存在，从标题生成slug
        if (title) {
            return title
                .toLowerCase()
                .replace(/[^\w\s-]/g, '')
                .replace(/\s+/g, '-')
                .replace(/-+/g, '-')
                .trim();
        }
        // 否则从文件名生成
        const fileName = path_1.default.basename(filePath, path_1.default.extname(filePath));
        return fileName
            .toLowerCase()
            .replace(/[^\w\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .trim();
    }
}
exports.MarkdownParser = MarkdownParser;
//# sourceMappingURL=parser.js.map