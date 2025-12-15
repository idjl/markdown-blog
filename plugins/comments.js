"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommentsPlugin = void 0;
/**
 * 评论系统插件
 */
class CommentsPlugin {
    constructor(config) {
        this.config = config;
    }
    /**
     * 应用插件
     */
    apply(context) {
        if (!this.config.comments.provider) {
            return;
        }
        // 根据评论系统提供商生成对应的脚本
        switch (this.config.comments.provider) {
            case 'utterances':
                this.setupUtterances(context);
                break;
            case 'giscus':
                this.setupGiscus(context);
                break;
            default:
                console.warn(`Unknown comments provider: ${this.config.comments.provider}`);
        }
    }
    /**
     * 设置 Utterances
     */
    setupUtterances(context) {
        const utterancesConfig = this.config.comments;
        if (!utterancesConfig.repo) {
            console.warn('Utterances repo not configured');
            return;
        }
        // 生成 Utterances 脚本
        const utterancesScript = `
      <script src="https://utteranc.es/client.js"
        repo="${utterancesConfig.repo}"
        issue-term="${utterancesConfig.issueTerm || 'pathname'}"
        theme="${utterancesConfig.theme || 'github-light'}"
        crossorigin="anonymous"
        async>
      </script>
    `;
        // 添加到模板上下文
        context.utterancesScript = utterancesScript;
    }
    /**
     * 设置 Giscus
     */
    setupGiscus(context) {
        const giscusConfig = this.config.comments;
        if (!giscusConfig.repo ||
            !giscusConfig.repoId ||
            !giscusConfig.categoryId) {
            console.warn('Giscus configuration incomplete');
            return;
        }
        // 生成 Giscus 脚本
        const giscusScript = `
      <script src="https://giscus.app/client.js"
        data-repo="${giscusConfig.repo}"
        data-repo-id="${giscusConfig.repoId}"
        data-category="${giscusConfig.category || 'General'}"
        data-category-id="${giscusConfig.categoryId}"
        data-mapping="${giscusConfig.mapping || 'pathname'}"
        data-reactions-enabled="${giscusConfig.reactionsEnabled || '1'}"
        data-emit-metadata="${giscusConfig.emitMetadata || '0'}"
        data-theme="${giscusConfig.theme || 'light'}"
        data-lang="zh-CN"
        crossorigin="anonymous"
        async>
      </script>
    `;
        // 添加到模板上下文
        context.giscusScript = giscusScript;
    }
    /**
     * 获取评论脚本
     */
    getCommentsScript() {
        if (!this.config.comments.provider) {
            return '';
        }
        switch (this.config.comments.provider) {
            case 'utterances':
                return `
          <div id="comments" class="comments-container">
            <script src="https://utteranc.es/client.js"
              repo="${this.config.comments.repo}"
              issue-term="${this.config.comments.issueTerm || 'pathname'}"
              theme="${this.config.comments.theme || 'github-light'}"
              crossorigin="anonymous"
              async>
            </script>
          </div>
        `;
            case 'giscus':
                return `
          <div id="comments" class="comments-container">
            <script src="https://giscus.app/client.js"
              data-repo="${this.config.comments.repo}"
              data-repo-id="${this.config.comments.repoId}"
              data-category="${this.config.comments.category || 'General'}"
              data-category-id="${this.config.comments.categoryId}"
              data-mapping="${this.config.comments.mapping || 'pathname'}"
              data-reactions-enabled="${this.config.comments.reactionsEnabled || '1'}"
              data-emit-metadata="${this.config.comments.emitMetadata || '0'}"
              data-theme="${this.config.comments.theme || 'light'}"
              data-lang="zh-CN"
              crossorigin="anonymous"
              async>
            </script>
          </div>
        `;
            default:
                return '';
        }
    }
}
exports.CommentsPlugin = CommentsPlugin;
//# sourceMappingURL=comments.js.map