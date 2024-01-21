import { format } from "../util/features";
import Documentation from "./documentation";
import Minutes from "./minutes";
import { v4 } from "uuid";

export class DocumentationManager {
  documentation: Documentation = new Documentation();

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
    // const blob = new Blob([JSON.stringify(this.findAll(), null, 2)]);
    // const file = new File([blob], "backup.json", {
    //   type: "application/json",
    // });
    // const url = URL.createObjectURL(file);
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
        this.download(type, this.findAll());
        break;
    }
  }
  upload(type: string, file: File, cb: () => void) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = JSON.parse(e.target.result as string);
      this.documentation.upload(result);
      cb();
    };
    reader.readAsText(file);
  }
  download(type: string, data: Minutes[]) {
    const filename = v4() + "." + type;
    const url = URL.createObjectURL(
      new File([new Blob([JSON.stringify(data, null, 2)])], "backup.json", {
        type: "application/json",
      })
    );
    const a = document.createElement("a");
    a.download = "backup-" + filename;
    a.href = url;
    a.click();
    a.remove();
  }
  clearAllDocuments() {
    this.documentation.clearAllDocuments();
  }
}
