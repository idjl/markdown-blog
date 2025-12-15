import 'dayjs/locale/zh-cn';
export declare class DateUtils {
    /**
     * 格式化日期
     */
    static format(date: Date | string, format?: string): string;
    /**
     * 格式化日期时间
     */
    static formatDateTime(date: Date | string, format?: string): string;
    /**
     * 获取相对时间
     */
    static fromNow(date: Date | string): string;
    /**
     * 获取相对时间（反向）
     */
    static toNow(date: Date | string): string;
    /**
     * 解析日期
     */
    static parse(date: string | Date): Date;
    /**
     * 检查是否为有效日期
     */
    static isValid(date: any): boolean;
    /**
     * 获取当前时间
     */
    static now(): Date;
    /**
     * 获取当前时间戳
     */
    static timestamp(): number;
    /**
     * 添加时间
     */
    static add(date: Date | string, amount: number, unit: 'day' | 'month' | 'year' | 'hour' | 'minute' | 'second'): Date;
    /**
     * 减去时间
     */
    static subtract(date: Date | string, amount: number, unit: 'day' | 'month' | 'year' | 'hour' | 'minute' | 'second'): Date;
    /**
     * 比较两个日期
     */
    static compare(date1: Date | string, date2: Date | string): number;
    /**
     * 检查日期是否在另一个日期之前
     */
    static isBefore(date1: Date | string, date2: Date | string): boolean;
    /**
     * 检查日期是否在另一个日期之后
     */
    static isAfter(date1: Date | string, date2: Date | string): boolean;
    /**
     * 检查两个日期是否相同
     */
    static isSame(date1: Date | string, date2: Date | string, unit?: 'day' | 'month' | 'year'): boolean;
    /**
     * 设置时区
     */
    static setTimezone(timezone: string): void;
    /**
     * 转换时区
     */
    static convertTimezone(date: Date | string, timezone: string): Date;
    /**
     * 获取月份开始时间
     */
    static startOfMonth(date: Date | string): Date;
    /**
     * 获取月份结束时间
     */
    static endOfMonth(date: Date | string): Date;
    /**
     * 获取年份开始时间
     */
    static startOfYear(date: Date | string): Date;
    /**
     * 获取年份结束时间
     */
    static endOfYear(date: Date | string): Date;
    /**
     * 获取周开始时间（周一）
     */
    static startOfWeek(date: Date | string): Date;
    /**
     * 获取周结束时间（周日）
     */
    static endOfWeek(date: Date | string): Date;
    /**
     * 获取日期所在年份
     */
    static getYear(date: Date | string): number;
    /**
     * 获取日期所在月份
     */
    static getMonth(date: Date | string): number;
    /**
     * 获取日期所在天
     */
    static getDate(date: Date | string): number;
    /**
     * 获取星期几
     */
    static getDay(date: Date | string): number;
    /**
     * 获取小时
     */
    static getHour(date: Date | string): number;
    /**
     * 获取分钟
     */
    static getMinute(date: Date | string): number;
    /**
     * 获取秒
     */
    static getSecond(date: Date | string): number;
    /**
     * 获取毫秒
     */
    static getMillisecond(date: Date | string): number;
    /**
     * 获取季度
     */
    static getQuarter(date: Date | string): number;
    /**
     * 获取一年中的第几周
     */
    static getWeekOfYear(date: Date | string): number;
    /**
     * 获取一年中的第几天
     */
    static getDayOfYear(date: Date | string): number;
    /**
     * 获取月份天数
     */
    static getDaysInMonth(date: Date | string): number;
}
export default DateUtils;
//# sourceMappingURL=date.d.ts.map