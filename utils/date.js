"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DateUtils = void 0;
const dayjs_1 = __importDefault(require("dayjs"));
require("dayjs/locale/zh-cn");
const localizedFormat_1 = __importDefault(require("dayjs/plugin/localizedFormat"));
const relativeTime_1 = __importDefault(require("dayjs/plugin/relativeTime"));
const utc_1 = __importDefault(require("dayjs/plugin/utc"));
const timezone_1 = __importDefault(require("dayjs/plugin/timezone"));
// 扩展dayjs功能
dayjs_1.default.extend(localizedFormat_1.default);
dayjs_1.default.extend(relativeTime_1.default);
dayjs_1.default.extend(utc_1.default);
dayjs_1.default.extend(timezone_1.default);
// 设置默认语言
dayjs_1.default.locale('zh-cn');
class DateUtils {
    /**
     * 格式化日期
     */
    static format(date, format = 'YYYY-MM-DD') {
        return (0, dayjs_1.default)(date).format(format);
    }
    /**
     * 格式化日期时间
     */
    static formatDateTime(date, format = 'YYYY-MM-DD HH:mm:ss') {
        return (0, dayjs_1.default)(date).format(format);
    }
    /**
     * 获取相对时间
     */
    static fromNow(date) {
        return (0, dayjs_1.default)(date).fromNow();
    }
    /**
     * 获取相对时间（反向）
     */
    static toNow(date) {
        return (0, dayjs_1.default)(date).toNow();
    }
    /**
     * 解析日期
     */
    static parse(date) {
        return (0, dayjs_1.default)(date).toDate();
    }
    /**
     * 检查是否为有效日期
     */
    static isValid(date) {
        return (0, dayjs_1.default)(date).isValid();
    }
    /**
     * 获取当前时间
     */
    static now() {
        return (0, dayjs_1.default)().toDate();
    }
    /**
     * 获取当前时间戳
     */
    static timestamp() {
        return (0, dayjs_1.default)().valueOf();
    }
    /**
     * 添加时间
     */
    static add(date, amount, unit) {
        return (0, dayjs_1.default)(date).add(amount, unit).toDate();
    }
    /**
     * 减去时间
     */
    static subtract(date, amount, unit) {
        return (0, dayjs_1.default)(date).subtract(amount, unit).toDate();
    }
    /**
     * 比较两个日期
     */
    static compare(date1, date2) {
        return (0, dayjs_1.default)(date1).diff((0, dayjs_1.default)(date2));
    }
    /**
     * 检查日期是否在另一个日期之前
     */
    static isBefore(date1, date2) {
        return (0, dayjs_1.default)(date1).isBefore((0, dayjs_1.default)(date2));
    }
    /**
     * 检查日期是否在另一个日期之后
     */
    static isAfter(date1, date2) {
        return (0, dayjs_1.default)(date1).isAfter((0, dayjs_1.default)(date2));
    }
    /**
     * 检查两个日期是否相同
     */
    static isSame(date1, date2, unit) {
        return (0, dayjs_1.default)(date1).isSame((0, dayjs_1.default)(date2), unit);
    }
    /**
     * 设置时区
     */
    static setTimezone(timezone) {
        dayjs_1.default.tz.setDefault(timezone);
    }
    /**
     * 转换时区
     */
    static convertTimezone(date, timezone) {
        return (0, dayjs_1.default)(date).tz(timezone).toDate();
    }
    /**
     * 获取月份开始时间
     */
    static startOfMonth(date) {
        return (0, dayjs_1.default)(date).startOf('month').toDate();
    }
    /**
     * 获取月份结束时间
     */
    static endOfMonth(date) {
        return (0, dayjs_1.default)(date).endOf('month').toDate();
    }
    /**
     * 获取年份开始时间
     */
    static startOfYear(date) {
        return (0, dayjs_1.default)(date).startOf('year').toDate();
    }
    /**
     * 获取年份结束时间
     */
    static endOfYear(date) {
        return (0, dayjs_1.default)(date).endOf('year').toDate();
    }
    /**
     * 获取周开始时间（周一）
     */
    static startOfWeek(date) {
        return (0, dayjs_1.default)(date).startOf('week').toDate();
    }
    /**
     * 获取周结束时间（周日）
     */
    static endOfWeek(date) {
        return (0, dayjs_1.default)(date).endOf('week').toDate();
    }
    /**
     * 获取日期所在年份
     */
    static getYear(date) {
        return (0, dayjs_1.default)(date).year();
    }
    /**
     * 获取日期所在月份
     */
    static getMonth(date) {
        return (0, dayjs_1.default)(date).month() + 1; // 月份从1开始
    }
    /**
     * 获取日期所在天
     */
    static getDate(date) {
        return (0, dayjs_1.default)(date).date();
    }
    /**
     * 获取星期几
     */
    static getDay(date) {
        return (0, dayjs_1.default)(date).day(); // 0 = 周日
    }
    /**
     * 获取小时
     */
    static getHour(date) {
        return (0, dayjs_1.default)(date).hour();
    }
    /**
     * 获取分钟
     */
    static getMinute(date) {
        return (0, dayjs_1.default)(date).minute();
    }
    /**
     * 获取秒
     */
    static getSecond(date) {
        return (0, dayjs_1.default)(date).second();
    }
    /**
     * 获取毫秒
     */
    static getMillisecond(date) {
        return (0, dayjs_1.default)(date).millisecond();
    }
    /**
     * 获取季度
     */
    static getQuarter(date) {
        const d = (0, dayjs_1.default)(date);
        return Math.floor((d.month() + 3) / 3);
    }
    /**
     * 获取一年中的第几周
     */
    static getWeekOfYear(date) {
        const d = (0, dayjs_1.default)(date);
        const firstDayOfYear = (0, dayjs_1.default)(d.year() + '-01-01');
        const dayOfYear = d.diff(firstDayOfYear, 'day') + 1;
        return Math.ceil(dayOfYear / 7);
    }
    /**
     * 获取一年中的第几天
     */
    static getDayOfYear(date) {
        const d = (0, dayjs_1.default)(date);
        const firstDayOfYear = (0, dayjs_1.default)(d.year() + '-01-01');
        return d.diff(firstDayOfYear, 'day') + 1;
    }
    /**
     * 获取月份天数
     */
    static getDaysInMonth(date) {
        return (0, dayjs_1.default)(date).daysInMonth();
    }
}
exports.DateUtils = DateUtils;
exports.default = DateUtils;
//# sourceMappingURL=date.js.map