import { format } from "../util/features";
import Timestamp from "./timestamp";
import Todo from "./todo";

export default class TodoManager {
  findGroupByTime(startTime: Date, endTime: Date): Todo[][] {
    const year = startTime.getFullYear();
    const month = startTime.getMonth();
    const date = startTime.getDate();
    // const baseTime = format(startTime, "YYYY-MM-dd");
    const temp = {};
    for (let i = date; i < date + 7; i++) {
      const timeIndex = format(new Date(year, month, i), "YYYY-MM-dd");
      temp[timeIndex] = [];
    }
    const timeList = this.findByTime(startTime, endTime);
    return Object.values(
      timeList.reduce((acc, cur) => {
        const timeIndex = cur.startTime.split("T")[0];
        if (!acc[timeIndex]) acc[timeIndex] = [];
        if (acc[timeIndex]) acc[timeIndex].push(cur);
        return acc;
      }, temp)
    );
  }

  findByTime(startTime: Date, endTime: Date) {
    const sTime = format(startTime, "YYYY-MM-ddTHH:mm:ss.SSS");
    const eTime = format(endTime, "YYYY-MM-ddTHH:mm:ss.SSS");
    return this.todoList.filter(
      (todo) => sTime <= todo.startTime && todo.endTime <= eTime
    );
  }

  private readonly TODO_STORAGE: string = "meeting-minutes/todolist";

  todoList: Todo[] = [];

  events: Record<string, ((data: TodoManager) => void)[]> = {};

  constructor() {
    this.initialize();
  }

  // on(key: string, event: (data: TodoManager) => void) {
  //   if (!this.events[key])
  //     this.events[key] = [] as ((data: TodoManager) => void)[];
  //   this.events[key].push(event);
  // }

  // emit(key: string) {
  //   this.events[key].forEach((event) => {
  //     event.call(this, this);
  //   });
  // }

  getNotifications() {
    return this.todoList.filter((todo) => {
      const now = new Timestamp();
      const startTime = new Timestamp(todo.startTime);
      const endTime = new Timestamp(todo.endTime);
      const isStartableTime =
        now.isAfterThan(startTime) || now.isSameAs(startTime);
      const isEndableTime = now.isAfterThan(endTime) || now.isSameAs(endTime);
      return todo.finished === false && (isStartableTime || isEndableTime);
    });
  }

  // todoNotification() {
  //   if (import.meta.env.DEV) {
  //     console.log("inner todo manager setup notification");
  //   }
  //   while (todoTimeoutQueue.length > 0) {
  //     const timeset = todoTimeoutQueue.shift();
  //     clearTimeout(timeset);
  //   }
  //   todoQueue.splice(0);
  //   const todos = this.findAll();
  //   for (const todo of todos) {
  //     if (todo.finished) continue;
  //     this.addNotification(todo);
  //   }
  // }

  // addNotification(todo: Todo) {
  //   const now = new Timestamp();
  //   const startTime = new Timestamp(todo.startTime);
  //   const endTime = new Timestamp(todo.endTime);
  //   startTime.removeSecond();
  //   startTime.removeMs();
  //   endTime.removeSecond();
  //   endTime.removeMs();
  //   if (startTime.isBeforeThan(now)) {
  //     todoQueue.push(todo);
  //     const noticeTime = now.getTime() - startTime.getTime();
  //     const timeset = setTimeout(
  //       () => {
  //         this.update(todo.id, todo);
  //         this.saveAll();
  //         pushMessage("[시작] " + todo.title, todo.content, todo.id);
  //         const index = todoQueue.findIndex((t) => t.id === todo.id);
  //         todoQueue.splice(index, 1);
  //         const nIndex = todoTimeoutQueue.findIndex(
  //           (n) => n === (timeset as unknown as number)
  //         );
  //         todoTimeoutQueue.splice(nIndex, 1);
  //         clearTimeout(timeset);
  //       },
  //       noticeTime < 0 ? 100 : noticeTime
  //     );
  //     todoTimeoutQueue.push(timeset as unknown as number);
  //   }
  //   if (now.isBeforeThan(endTime) || todo.finished === false) {
  //     todoQueue.push(todo);
  //     const noticeTime = endTime.getTime() - now.getTime();
  //     const timeset = setTimeout(
  //       () => {
  //         todo.finish();
  //         this.update(todo.id, todo);
  //         this.saveAll();
  //         pushMessage("[종료] " + todo.title, todo.content, todo.id);
  //         const index = todoQueue.findIndex((t) => t.id === todo.id);
  //         todoQueue.splice(index, 1);
  //         const nIndex = todoTimeoutQueue.findIndex(
  //           (n) => n === (timeset as unknown as number)
  //         );
  //         todoTimeoutQueue.splice(nIndex, 1);
  //         clearTimeout(timeset);
  //       },
  //       noticeTime < 0 ? 100 : noticeTime
  //     );
  //     todoTimeoutQueue.push(timeset as unknown as number);
  //   }
  // }

  /* storage management */
  initialize() {
    if (!this.has(this.TODO_STORAGE)) {
      this.saveAll();
    }
    this.todoList = this.load();
    this.saveAll();
    // this.todoNotification();
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

  clearAllTodos() {
    this.clear();
    this.todoList = this.save(this.TODO_STORAGE, []);
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
      // this.addNotification(todo);
    } else {
      this.updateSequenceBy();
      this.todoList.push(todo);
      // this.addNotification(todo);
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

  update(id: string, values: Todo) {
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
