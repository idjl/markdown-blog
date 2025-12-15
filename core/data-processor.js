"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataProcessor = void 0;
class DataProcessor {
    /**
     * 处理文章数据，生成分类、标签、归档等统计信息
     */
    static processPosts(posts) {
        const categories = this.processCategories(posts);
        const tags = this.processTags(posts);
        const archives = this.processArchives(posts);
        const stats = this.generateStats(posts, categories, tags, archives);
        return {
            categories,
            tags,
            archives,
            stats,
        };
    }
    /**
     * 处理分类数据
     */
    static processCategories(posts) {
        const categoryMap = new Map();
        posts.forEach(post => {
            if (post.category) {
                if (!categoryMap.has(post.category)) {
                    categoryMap.set(post.category, []);
                }
                categoryMap.get(post.category).push(post);
            }
        });
        return Array.from(categoryMap.entries())
            .map(([name, posts]) => ({
            name,
            slug: this.generateSlug(name),
            count: posts.length,
            posts: posts.sort((a, b) => b.date.getTime() - a.date.getTime()),
        }))
            .sort((a, b) => b.count - a.count);
    }
    /**
     * 处理标签数据
     */
    static processTags(posts) {
        const tagMap = new Map();
        posts.forEach(post => {
            post.tags.forEach(tag => {
                if (!tagMap.has(tag)) {
                    tagMap.set(tag, []);
                }
                tagMap.get(tag).push(post);
            });
        });
        return Array.from(tagMap.entries())
            .map(([name, posts]) => ({
            name,
            slug: this.generateSlug(name),
            count: posts.length,
            posts: posts.sort((a, b) => b.date.getTime() - a.date.getTime()),
        }))
            .sort((a, b) => b.count - a.count);
    }
    /**
     * 处理归档数据
     */
    static processArchives(posts) {
        const archiveMap = new Map();
        posts.forEach(post => {
            const year = post.date.getFullYear();
            const month = post.date.getMonth() + 1;
            const key = `${year}-${month.toString().padStart(2, '0')}`;
            if (!archiveMap.has(key)) {
                archiveMap.set(key, []);
            }
            archiveMap.get(key).push(post);
        });
        return Array.from(archiveMap.entries())
            .map(([key, posts]) => {
            const [year, month] = key.split('-').map(Number);
            return {
                year,
                month,
                count: posts.length,
                posts: posts.sort((a, b) => b.date.getTime() - a.date.getTime()),
            };
        })
            .sort((a, b) => {
            if (a.year !== b.year)
                return b.year - a.year;
            return b.month - a.month;
        });
    }
    /**
     * 生成统计信息
     */
    static generateStats(posts, categories, tags, archives) {
        const totalWords = posts.reduce((sum, post) => sum + (post.wordCount || 0), 0);
        const totalReadingTime = posts.reduce((sum, post) => sum + (post.readingTime || 0), 0);
        // 获取最早和最晚的文章日期
        const dates = posts.map(post => post.date.getTime());
        const earliestDate = dates.length > 0 ? new Date(Math.min(...dates)) : null;
        const latestDate = dates.length > 0 ? new Date(Math.max(...dates)) : null;
        // 计算活跃天数
        let activeDays = 0;
        if (earliestDate && latestDate) {
            const diffTime = Math.abs(latestDate.getTime() - earliestDate.getTime());
            activeDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
        }
        return {
            totalPosts: posts.length,
            totalWords,
            totalReadingTime,
            totalCategories: categories.length,
            totalTags: tags.length,
            totalArchives: archives.length,
            averageWordsPerPost: posts.length > 0 ? Math.round(totalWords / posts.length) : 0,
            averageReadingTimePerPost: posts.length > 0 ? Math.round(totalReadingTime / posts.length) : 0,
            earliestPost: earliestDate,
            latestPost: latestDate,
            activeDays,
            postsPerDay: activeDays > 0
                ? Math.round((posts.length / activeDays) * 100) / 100
                : 0,
        };
    }
    /**
     * 生成URL友好的slug
     */
    static generateSlug(text) {
        return text
            .toLowerCase()
            .replace(/[^\w\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .trim();
    }
    /**
     * 生成分类页面数据
     */
    static generateCategoryPages(categories, postsPerPage) {
        const pages = [];
        categories.forEach(category => {
            const totalPages = Math.ceil(category.posts.length / postsPerPage);
            for (let page = 1; page <= totalPages; page++) {
                const start = (page - 1) * postsPerPage;
                const end = start + postsPerPage;
                const posts = category.posts.slice(start, end);
                pages.push({
                    category,
                    page,
                    totalPages,
                    posts,
                });
            }
        });
        return pages;
    }
    /**
     * 生成标签页面数据
     */
    static generateTagPages(tags, postsPerPage) {
        const pages = [];
        tags.forEach(tag => {
            const totalPages = Math.ceil(tag.posts.length / postsPerPage);
            for (let page = 1; page <= totalPages; page++) {
                const start = (page - 1) * postsPerPage;
                const end = start + postsPerPage;
                const posts = tag.posts.slice(start, end);
                pages.push({
                    tag,
                    page,
                    totalPages,
                    posts,
                });
            }
        });
        return pages;
    }
    /**
     * 生成归档页面数据
     */
    static generateArchivePages(archives, postsPerPage) {
        const pages = [];
        archives.forEach(archive => {
            const totalPages = Math.ceil(archive.posts.length / postsPerPage);
            for (let page = 1; page <= totalPages; page++) {
                const start = (page - 1) * postsPerPage;
                const end = start + postsPerPage;
                const posts = archive.posts.slice(start, end);
                pages.push({
                    archive,
                    page,
                    totalPages,
                    posts,
                });
            }
        });
        return pages;
    }
    /**
     * 生成首页分页数据
     */
    static generateHomePages(posts, postsPerPage) {
        const totalPages = Math.ceil(posts.length / postsPerPage);
        const pages = [];
        for (let page = 1; page <= totalPages; page++) {
            const start = (page - 1) * postsPerPage;
            const end = start + postsPerPage;
            const pagePosts = posts.slice(start, end);
            pages.push({
                page,
                totalPages,
                posts: pagePosts,
            });
        }
        return pages;
    }
}
exports.DataProcessor = DataProcessor;
//# sourceMappingURL=data-processor.js.map