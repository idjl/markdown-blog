import { TemplateData, BlogConfig } from '../types';
export declare class TemplateEngine {
    private templates;
    private config;
    constructor(config: BlogConfig);
    /**
     * 加载模板文件
     */
    private loadTemplates;
    /**
     * 加载默认模板
     */
    private loadDefaultTemplates;
    /**
     * 渲染模板
     */
    render(templateName: string, data: TemplateData): string;
    /**
     * 替换模板变量
     */
    private replaceVariables;
    /**
     * 处理条件语句
     */
    private processConditionals;
    /**
     * 评估条件
     */
    private evaluateCondition;
    /**
     * 获取值
     */
    private getValue;
    /**
     * 渲染布局模板
     */
    private renderLayout;
    /**
     * 生成元数据
     */
    private generateMetaData;
    /**
     * 默认布局模板
     */
    private getDefaultLayoutTemplate;
    /**
     * 默认首页模板
     */
    private getDefaultIndexTemplate;
    /**
     * 默认文章页面模板
     */
    private getDefaultPostTemplate;
    /**
     * 默认分类页面模板
     */
    private getDefaultCategoryTemplate;
    /**
     * 默认标签页面模板
     */
    private getDefaultTagTemplate;
    /**
     * 默认归档页面模板
     */
    private getDefaultArchiveTemplate;
    /**
     * 默认搜索页面模板
     */
    private getDefaultSearchTemplate;
    /**
     * 默认404页面模板
     */
    private getDefault404Template;
}
//# sourceMappingURL=template-engine.d.ts.map