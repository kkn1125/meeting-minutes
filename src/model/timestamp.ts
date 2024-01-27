import { format } from "../util/features";

export default class Timestamp extends Date {
  initialize(timestamp: Timestamp | Date) {
    this.setFullYear(timestamp.getFullYear());
    this.setMonth(timestamp.getMonth());
    this.setDate(timestamp.getDate());
    this.setHours(timestamp.getHours());
    this.setMinutes(timestamp.getMinutes());
    this.setSeconds(timestamp.getSeconds());
    this.setMilliseconds(timestamp.getMilliseconds());
  }

  addYear(year: number) {
    this.setFullYear(this.getFullYear() + year);
  }
  addMonth(month: number) {
    this.setMonth(this.getMonth() + month);
  }
  addDate(date: number) {
    this.setDate(this.getDate() + date);
  }
  addHour(hour: number) {
    this.setHours(this.getHours() + hour);
  }
  addMinute(minute: number) {
    this.setMinutes(this.getMinutes() + minute);
  }
  addSecond(second: number) {
    this.setSeconds(this.getSeconds() + second);
  }
  addMilliSecond(ms: number) {
    this.setMilliseconds(this.getMilliseconds() + ms);
  }

  add({ year, month, date, hour, minute, second, ms }: Record<string, number>) {
    year && this.addYear(year);
    month && this.addMonth(month);
    date && this.addDate(date);
    hour && this.addHour(hour);
    minute && this.addMinute(minute);
    second && this.addSecond(second);
    ms && this.addMilliSecond(ms);
    return this;
  }

  removeSecond() {
    this.setSeconds(0);
  }
  removeMs() {
    this.setMilliseconds(0);
  }

  compare(timestamp: Timestamp) {
    return format(this, "YYYY-MM-dd HH:mm:ss.SSS").localeCompare(
      format(timestamp, "YYYY-MM-dd HH:mm:ss.SSS")
    );
  }
  isBeforeThan(timestamp: Timestamp) {
    return this.compare(timestamp) === -1;
  }
  isAfterThan(timestamp: Timestamp) {
    return this.compare(timestamp) === 1;
  }
  isSameAs(timestamp: Timestamp) {
    return this.compare(timestamp) === 0;
  }
  toString() {
    return format(this, "YYYY-MM-ddTHH:mm:ss.SSS");
  }
  toDate() {
    return this;
  }
}
