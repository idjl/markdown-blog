import { BlogConfig } from '../types';
/**
 * 语法高亮插件
 */
export declare class SyntaxHighlightPlugin {
    private config;
    constructor(config: BlogConfig);
    /**
     * 应用插件
     */
    apply(context: any): void;
    /**
     * 高亮代码
     */
    private highlightCode;
    /**
     * 转义HTML
     */
    private escapeHtml;
    /**
     * 生成语法高亮CSS
     */
    generateCSS(outputDir: string): Promise<void>;
}
//# sourceMappingURL=syntax-highlight.d.ts.map