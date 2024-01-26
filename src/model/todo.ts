import { v4 } from "uuid";
import Timestamp from "./timestamp";
import { pushMessage } from "../util/features";

export interface TodoType {
  id: string;
  title: string;
  content: string;
  startTime: string;
  endTime: string;
  finished: boolean;
  keep: boolean;
  sequence: number;
  started: boolean;
  ended: boolean;
}
export interface TodoInitialValues
  extends Omit<
    TodoType,
    "id" | "finished" | "keep" | "sequence" | "started" | "ended"
  > {}

export default class Todo {
  static time(): Timestamp;
  static time(year: number): Timestamp;
  static time(year: number, month: number): Timestamp;
  static time(year: number, month: number, date: number): Timestamp;
  static time(
    year: number,
    month: number,
    date: number,
    hour: number
  ): Timestamp;
  static time(
    year: number,
    month: number,
    date: number,
    hour: number,
    minutes: number
  ): Timestamp;
  static time(
    year: number,
    month: number,
    date: number,
    hour: number,
    minutes: number,
    seconds: number
  ): Timestamp;
  static time(
    year: number,
    month: number,
    date: number,
    hour: number,
    minutes: number,
    seconds: number,
    milliseconds: number
  ): Timestamp;
  static time(
    year?: number,
    month?: number,
    date?: number,
    hour?: number,
    minutes?: number,
    seconds?: number,
    milliseconds?: number
  ): Timestamp {
    const array = [
      year,
      month ? month - 1 : 0,
      date ?? 1,
      hour ?? 0,
      minutes ?? 0,
      seconds ?? 0,
      milliseconds ?? 0,
    ].filter((_) => !isNaN(_));
    const time = year
      ? new (Timestamp.bind(Timestamp, ...array))()
      : new Timestamp();
    return time;
  }
  static now() {
    const now = new Timestamp();
    return now;
  }

  id: string;
  title: string;
  content: string;
  startTime: string;
  endTime: string;
  finished: boolean;
  keep: boolean;
  sequence: number;
  started: boolean;
  ended: boolean;

  constructor(todo: TodoType);
  constructor(todo: TodoInitialValues);
  constructor(todo: Partial<TodoInitialValues & TodoType>) {
    if ("id" in todo) {
      const now = new Timestamp();
      const startTime = new Timestamp(todo.startTime);
      const endTime = new Timestamp(todo.endTime);

      this.id = todo.id ?? "todo-" + v4();
      this.title = todo.title;
      this.content = todo.content;
      this.startTime = todo.startTime;
      this.endTime = todo.endTime;
      this.finished = todo?.finished ?? false;
      this.keep = todo?.keep ?? false;
      this.sequence = todo?.sequence ?? 0;
      this.started = todo?.started || startTime.isBeforeThan(now);
      this.ended = todo?.ended || endTime.isBeforeThan(now);
    } else {
      this.id = "todo-" + v4();
      this.title = todo.title;
      this.content = todo.content;
      this.startTime = todo.startTime;
      this.endTime = todo.endTime;
      this.finished = false;
      this.keep = false;
      this.sequence = 0;
      this.started = false;
      this.ended = false;
    }
  }

  update(values: TodoInitialValues & TodoType) {
    this.title = values.title;
    this.content = values.content;
    this.startTime = values.startTime;
    this.endTime = values.endTime;
    this.finished = values.finished;
    this.started = values.started;
    this.ended = values.ended;
  }

  changeSequence(sequence: number) {
    this.sequence = sequence;
  }

  setSequence(sequence: number) {
    this.sequence = sequence;
  }

  finish() {
    this.finished = true;
  }

  unfinish() {
    this.finished = false;
  }

  notifyStart() {
    this.started = true;
  }

  unnotifyStart() {
    this.started = false;
  }

  notifyEnd() {
    this.ended = true;
  }

  unnotifyEnd() {
    this.ended = false;
  }

  isStartTime() {
    const now = new Timestamp();
    now.removeSecond();
    now.removeMs();
    const startTime = new Timestamp(this.startTime);
    return startTime.isSameAs(now);
  }

  isEndTime() {
    const now = new Timestamp();
    now.removeSecond();
    now.removeMs();
    const endTime = new Timestamp(this.endTime);
    return endTime.isSameAs(now);
  }

  isEndTimeOrPassed() {
    const now = new Timestamp();
    now.removeSecond();
    now.removeMs();
    const endTime = new Timestamp(this.endTime);
    return endTime.isSameAs(now) || endTime.isBeforeThan(now);
  }

  // notification(level: NotificationLevel) {

  // }
}
