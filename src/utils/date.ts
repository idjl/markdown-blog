import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import relativeTime from 'dayjs/plugin/relativeTime';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

// 扩展dayjs功能
dayjs.extend(localizedFormat);
dayjs.extend(relativeTime);
dayjs.extend(utc);
dayjs.extend(timezone);

// 设置默认语言
dayjs.locale('zh-cn');

export class DateUtils {
  /**
   * 格式化日期
   */
  static format(date: Date | string, format: string = 'YYYY-MM-DD'): string {
    return dayjs(date).format(format);
  }

  /**
   * 格式化日期时间
   */
  static formatDateTime(date: Date | string, format: string = 'YYYY-MM-DD HH:mm:ss'): string {
    return dayjs(date).format(format);
  }

  /**
   * 获取相对时间
   */
  static fromNow(date: Date | string): string {
    return dayjs(date).fromNow();
  }

  /**
   * 获取相对时间（反向）
   */
  static toNow(date: Date | string): string {
    return dayjs(date).toNow();
  }

  /**
   * 解析日期
   */
  static parse(date: string | Date): Date {
    return dayjs(date).toDate();
  }

  /**
   * 检查是否为有效日期
   */
  static isValid(date: any): boolean {
    return dayjs(date).isValid();
  }

  /**
   * 获取当前时间
   */
  static now(): Date {
    return dayjs().toDate();
  }

  /**
   * 获取当前时间戳
   */
  static timestamp(): number {
    return dayjs().valueOf();
  }

  /**
   * 添加时间
   */
  static add(date: Date | string, amount: number, unit: 'day' | 'month' | 'year' | 'hour' | 'minute' | 'second'): Date {
    return dayjs(date).add(amount, unit).toDate();
  }

  /**
   * 减去时间
   */
  static subtract(date: Date | string, amount: number, unit: 'day' | 'month' | 'year' | 'hour' | 'minute' | 'second'): Date {
    return dayjs(date).subtract(amount, unit).toDate();
  }

  /**
   * 比较两个日期
   */
  static compare(date1: Date | string, date2: Date | string): number {
    return dayjs(date1).diff(dayjs(date2));
  }

  /**
   * 检查日期是否在另一个日期之前
   */
  static isBefore(date1: Date | string, date2: Date | string): boolean {
    return dayjs(date1).isBefore(dayjs(date2));
  }

  /**
   * 检查日期是否在另一个日期之后
   */
  static isAfter(date1: Date | string, date2: Date | string): boolean {
    return dayjs(date1).isAfter(dayjs(date2));
  }

  /**
   * 检查两个日期是否相同
   */
  static isSame(date1: Date | string, date2: Date | string, unit?: 'day' | 'month' | 'year'): boolean {
    return dayjs(date1).isSame(dayjs(date2), unit);
  }

  /**
   * 设置时区
   */
  static setTimezone(timezone: string): void {
    dayjs.tz.setDefault(timezone);
  }

  /**
   * 转换时区
   */
  static convertTimezone(date: Date | string, timezone: string): Date {
    return dayjs(date).tz(timezone).toDate();
  }

  /**
   * 获取月份开始时间
   */
  static startOfMonth(date: Date | string): Date {
    return dayjs(date).startOf('month').toDate();
  }

  /**
   * 获取月份结束时间
   */
  static endOfMonth(date: Date | string): Date {
    return dayjs(date).endOf('month').toDate();
  }

  /**
   * 获取年份开始时间
   */
  static startOfYear(date: Date | string): Date {
    return dayjs(date).startOf('year').toDate();
  }

  /**
   * 获取年份结束时间
   */
  static endOfYear(date: Date | string): Date {
    return dayjs(date).endOf('year').toDate();
  }

  /**
   * 获取周开始时间（周一）
   */
  static startOfWeek(date: Date | string): Date {
    return dayjs(date).startOf('week').toDate();
  }

  /**
   * 获取周结束时间（周日）
   */
  static endOfWeek(date: Date | string): Date {
    return dayjs(date).endOf('week').toDate();
  }

  /**
   * 获取日期所在年份
   */
  static getYear(date: Date | string): number {
    return dayjs(date).year();
  }

  /**
   * 获取日期所在月份
   */
  static getMonth(date: Date | string): number {
    return dayjs(date).month() + 1; // 月份从1开始
  }

  /**
   * 获取日期所在天
   */
  static getDate(date: Date | string): number {
    return dayjs(date).date();
  }

  /**
   * 获取星期几
   */
  static getDay(date: Date | string): number {
    return dayjs(date).day(); // 0 = 周日
  }

  /**
   * 获取小时
   */
  static getHour(date: Date | string): number {
    return dayjs(date).hour();
  }

  /**
   * 获取分钟
   */
  static getMinute(date: Date | string): number {
    return dayjs(date).minute();
  }

  /**
   * 获取秒
   */
  static getSecond(date: Date | string): number {
    return dayjs(date).second();
  }

  /**
   * 获取毫秒
   */
  static getMillisecond(date: Date | string): number {
    return dayjs(date).millisecond();
  }

  /**
   * 获取季度
   */
  static getQuarter(date: Date | string): number {
    const d = dayjs(date);
    return Math.floor((d.month() + 3) / 3);
  }

  /**
   * 获取一年中的第几周
   */
  static getWeekOfYear(date: Date | string): number {
    const d = dayjs(date);
    const firstDayOfYear = dayjs(d.year() + '-01-01');
    const dayOfYear = d.diff(firstDayOfYear, 'day') + 1;
    return Math.ceil(dayOfYear / 7);
  }

  /**
   * 获取一年中的第几天
   */
  static getDayOfYear(date: Date | string): number {
    const d = dayjs(date);
    const firstDayOfYear = dayjs(d.year() + '-01-01');
    return d.diff(firstDayOfYear, 'day') + 1;
  }

  /**
   * 获取月份天数
   */
  static getDaysInMonth(date: Date | string): number {
    return dayjs(date).daysInMonth();
  }
}

export default DateUtils;