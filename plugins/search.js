"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SearchIndexGenerator = void 0;
const utils_1 = require("../utils");
const path_1 = __importDefault(require("path"));
/**
 * 生成搜索索引
 */
class SearchIndexGenerator {
    /**
     * 生成搜索索引
     */
    static async generate(posts, outputDir) {
        const searchIndex = posts.map(post => ({
            title: post.title,
            content: this.stripHtml(post.content),
            excerpt: post.excerpt,
            url: post.url,
            date: post.date.toISOString(),
            tags: post.tags,
            category: post.category,
            author: post.author,
            readingTime: post.readingTime,
            wordCount: post.wordCount,
        }));
        const searchIndexPath = path_1.default.join(outputDir, 'search-index.json');
        await utils_1.FileUtils.writeFile(searchIndexPath, JSON.stringify(searchIndex, null, 2));
    }
    /**
     * 移除HTML标签
     */
    static stripHtml(html) {
        return html
            .replace(/<[^>]*>/g, '')
            .replace(/&nbsp;/g, ' ')
            .replace(/&amp;/g, '&')
            .replace(/&lt;/g, '<')
            .replace(/&gt;/g, '>')
            .replace(/&quot;/g, '"')
            .replace(/&#39;/g, "'")
            .trim();
    }
}
exports.SearchIndexGenerator = SearchIndexGenerator;
//# sourceMappingURL=search.js.map