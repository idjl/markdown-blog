import { Post } from '../types';
export declare class MarkdownParser {
    private md;
    constructor();
    private setupPlugins;
    parse(filePath: string): Promise<Post>;
    private normalizeFrontMatter;
    private generateExcerpt;
    private countWords;
    private calculateReadingTime;
    private generateSlug;
}
//# sourceMappingURL=parser.d.ts.map