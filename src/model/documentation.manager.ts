import { format, pushMessage } from "../util/features";
import Documentation from "./documentation";
import Minutes from "./minutes";
import { v4 } from "uuid";
import Todo from "./todo";
import TodoManager from "./todo.manager";
import { todoQueue, todoTimeoutQueue } from "../util/global";
import Timestamp from "./timestamp";

export class DocumentationManager {
  private readonly STORAGE_NAME: string = "meeting-minutes";
  private readonly CATEGORY_STORAGE_NAME: string = "meeting-minutes/categories";
  private readonly TODO_STORAGE: string = "meeting-minutes/todolist";

  documentation: Documentation = new Documentation();
  todoManager: TodoManager = new TodoManager();

  findAll() {
    return this.documentation.findAll();
  }
  findOne(id: string) {
    return this.documentation.findOne(id);
  }
  findByTime(startTime: Date, endTime: Date) {
    return this.documentation.findByTime(startTime, endTime);
  }
  findGroupByTime(startTime: Date, endTime: Date): Minutes[][] {
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
        const timeIndex = cur.createdAt.split("T")[0];
        if (!acc[timeIndex]) acc[timeIndex] = [];
        if (acc[timeIndex]) acc[timeIndex].push(cur);
        return acc;
      }, temp)
    );
  }
  add(minutes: Minutes) {
    this.documentation.add(minutes);
  }
  update(id: string, minutes: Minutes) {
    this.documentation.update(id, minutes);
  }
  remove(id: string) {
    this.documentation.remove(id);
  }
  saveAll() {
    this.documentation.saveAll();
  }
  jsonToUrl() {
    const jsonUrl = encodeURIComponent(JSON.stringify(this.findAll()));
    return jsonUrl;
  }
  import(type: string, file: File, cb: () => void) {
    switch (type) {
      case "json":
        this.upload(type, file, cb);
        break;
    }
  }
  export(type: string) {
    switch (type) {
      case "json":
        this.download(type, {
          minutes: this.findAll(),
          todolist: this.todoManager.findAll(),
        });
        break;
    }
  }
  upload(type: string, file: File, cb: () => void) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = JSON.parse(e.target.result as string);
      const minutes = result["minutes"];
      const todolist = result["todolist"];
      this.documentation.upload(minutes);
      this.todoManager.upload(todolist);
      cb();
    };
    reader.readAsText(file);
  }
  createBlob(data: Record<"minutes" | "todolist", Minutes[] | Todo[]>) {
    return new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
  }
  createFile(
    data: Record<"minutes" | "todolist", Minutes[] | Todo[]>,
    type = "json"
  ) {
    const filename = "backup-" + v4() + "." + type;
    return new File([this.createBlob(data)], filename, {
      type: "application/json",
    });
  }
  download(
    type: string,
    data: Record<"minutes" | "todolist", Minutes[] | Todo[]>
  ) {
    const file = this.createFile(data, type);
    const url = URL.createObjectURL(file);
    const a = document.createElement("a");
    a.download = file.name;
    a.href = url;
    a.click();
    a.remove();
  }
  clearAllDocuments() {
    this.documentation.clearAllDocuments();
  }
}
export const docuManager = new DocumentationManager();
