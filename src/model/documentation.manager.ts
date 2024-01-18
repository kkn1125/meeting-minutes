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
      new File([new Blob([JSON.stringify(data, null, 2)])], "test.json", {
        type: "application/json",
      })
    );
    const a = document.createElement("a");
    a.download = filename;
    a.href = url;
    a.click();
    a.remove();
  }
  clearAllDocuments() {
    this.documentation.clearAllDocuments();
  }
}
