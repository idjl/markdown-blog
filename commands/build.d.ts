import { BlogConfig } from '../types';
export declare class BuildCommand {
    private config;
    private generator;
    constructor(config?: BlogConfig);
    /**
     * 执行构建命令
     */
    execute(): Promise<void>;
}
//# sourceMappingURL=build.d.ts.map