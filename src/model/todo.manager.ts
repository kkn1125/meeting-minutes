import { pushMessage } from "../util/features";
import { todoQueue, todoTimeoutQueue } from "../util/global";
import Timestamp from "./timestamp";
import Todo, { TodoInitialValues, TodoType } from "./todo";

export default class TodoManager {
  private readonly TODO_STORAGE: string = "meeting-minutes/todolist";

  todoList: Todo[] = [];

  constructor() {
    this.initialize();
  }

  todoNotification() {
    if (import.meta.env.DEV) {
      console.log("inner todo manager setup notification");
    }
    while (todoTimeoutQueue.length > 0) {
      const timeset = todoTimeoutQueue.shift();
      clearTimeout(timeset);
    }
    todoQueue.splice(0);
    const todos = this.findAll();
    for (const todo of todos) {
      if (todo.finished) continue;
      this.addNotification(todo);
    }
  }

  addNotification(todo: Todo) {
    const now = new Timestamp();
    const endTime = new Timestamp(todo.endTime);
    if (now.isBeforeThan(endTime) || !todo.finished) {
      todoQueue.push(todo);
      const noticeTime = endTime.getTime() - now.getTime();
      const timeset = setTimeout(
        () => {
          todo.finish();
          pushMessage(todo.title, todo.content, todo.id);
          this.saveAll();
        },
        noticeTime < 0 ? 100 : noticeTime
      );
      todoTimeoutQueue.push(timeset as unknown as number);
    }
  }

  /* storage management */
  initialize() {
    if (!this.has(this.TODO_STORAGE)) {
      this.saveAll();
    }
    this.todoList = this.load();
    this.saveAll();
    this.todoNotification();
  }

  has(key: string) {
    return key in localStorage;
  }

  load() {
    const jsonString = localStorage.getItem(this.TODO_STORAGE);
    const todolist = JSON.parse(jsonString) as Todo[];
    return todolist.map((todo) => new Todo(todo));
  }

  upload(todolist: any) {
    const origins = (this.load() as Todo[]).map((m) => new Todo(m));
    const uploaded: Todo[] = todolist.map((m) => new Todo(m));
    this.todoList = [...origins, ...uploaded].reduce((acc, cur) => {
      if (acc.every((a) => a.id !== cur.id)) {
        acc.push(cur);
      }
      return acc;
    }, []);
    this.todoList = this.save(this.TODO_STORAGE, this.todoList);
  }

  save(key: string, data: Todo[]) {
    localStorage.setItem(key, JSON.stringify(data));
    return this.load();
  }

  saveAll() {
    const jsonString = JSON.stringify(this.todoList);
    localStorage.setItem(this.TODO_STORAGE, jsonString);
  }

  /* todo list management */
  findAll() {
    return this.todoList;
  }

  findOne(id: string) {
    return this.todoList.find((todo) => todo.id === id);
  }

  add(todo: Todo): void {
    if ("id" in todo) {
      this.updateSequenceBy();
      this.todoList.push(todo);
      this.addNotification(todo);
    } else {
      this.updateSequenceBy();
      this.todoList.push(todo);
      this.addNotification(todo);
    }
    this.saveAll();
    this.todoList = this.load();
  }

  addTo(todo: Todo, sequence: number) {
    this.updateSequenceBy(sequence);
    this.todoList.push(todo);
    this.saveAll();
    this.todoList = this.load();
  }

  changeSequence(id: string, sequence: number) {
    const todo = this.findOne(id);
    if (todo) {
      this.updateSequenceBy(sequence);
      todo.changeSequence(sequence);
    }
    this.saveAll();
    this.todoList = this.load();
  }

  update(id: string, values: TodoInitialValues) {
    const todo = this.findOne(id);
    todo.update(values);
    this.saveAll();
    this.todoList = this.load();
  }

  updateSequenceBy(sequence: number = 0) {
    this.todoList = this.todoList.map((todo) => {
      if (todo.sequence >= sequence) {
        todo.sequence += 1;
      }
      return todo;
    });
    this.saveAll();
    this.todoList = this.load();
  }

  remove(id: string) {
    this.todoList = this.todoList.filter((todo) => todo.id !== id);
    this.saveAll();
    this.todoList = this.load();
  }

  clear() {
    this.todoList = [];
    this.saveAll();
    this.todoList = this.load();
  }

  finishBy(id: string) {
    const todo = this.findOne(id);
    if (todo) {
      todo.finish();
    }
    this.saveAll();
  }
  unfinishBy(id: string) {
    const todo = this.findOne(id);
    if (todo) {
      todo.unfinish();
    }
    this.todoList = this.load();
  }
}
