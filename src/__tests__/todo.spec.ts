import Timestamp from "../model/timestamp";
import Todo from "../model/todo";
import TodoManager from "../model/todo.manager";
import { format } from "../util/features";

const todoManager = new TodoManager();

describe("test tool", () => {
  beforeEach(() => {
    const now = format(Todo.now(), "YYYY-MM-ddTHH:mm:ss.SSS");
    const timestamp = Todo.time();
    timestamp.addHour(12);
    const time = format(timestamp, "YYYY-MM-ddTHH:mm:ss.SSS");
    todoManager.add(
      new Todo({
        title: "공부",
        content: "백엔드",
        startTime: now,
        endTime: time,
        important: 0,
      })
    );
  });
  afterEach(() => {
    todoManager.clear();
  });

  it("test", () => {
    expect(1 + 1).toStrictEqual(2);
  });
  it("time create and minus", () => {
    const time = new Timestamp(2024, 0, 24, 15, 30);
    // time.addYear(-2);
    time.add({ year: -2 });
    expect(time.getFullYear()).toStrictEqual(2022);
    time.add({ year: -1, month: -2 });
    // time.addMonth(-2);
    expect(time.getFullYear()).toStrictEqual(2020);
    expect(time.getMonth()).toStrictEqual(10);
  });
  it("time before than", () => {
    const time = new Timestamp(2024, 0, 24, 12, 30);
    const time3 = new Timestamp(2024, 0, 24, 12, 30);
    const time2 = new Timestamp(2024, 1, 24, 12, 30);

    expect(time.isBeforeThan(time2)).toStrictEqual(true);
    expect(time2.isAfterThan(time)).toStrictEqual(true);
    expect(time3.isSameAs(time)).toStrictEqual(true);
  });
  it("todo add test", () => {
    expect(todoManager.todoList.length).toStrictEqual(1);
  });

  it("todo remove test", () => {
    const todo = todoManager.todoList.at(0);
    if (todo) {
      todoManager.remove(todo.id);
    }
    expect(todoManager.todoList.length).toStrictEqual(0);
  });

  it("todo done test", () => {
    const todo = todoManager.todoList.at(0);
    if (todo) {
      todo.finish();
      expect(todo.finished).toStrictEqual(true);
    }
  });
  it("todo done test", () => {
    const todo = todoManager.todoList.at(0);
    if (todo) {
      todo.finish();
      todo.unfinish();
      expect(todo.finished).toStrictEqual(false);
    }
  });
});
