import { TransferWithinAStation } from "@mui/icons-material";
import Minutes from "./minutes";
import { Dispatch, SetStateAction } from "react";
import { format } from "../util/features";

export type Category = {
  caption: string;
  inputValue: string;
};

export default class Documentation {
  version: number = 0;
  private readonly STORAGE_NAME: string = "meeting-minutes";
  private readonly CATEGORY_STORAGE_NAME: string = "meeting-minutes/categories";
  private temp: Minutes[] = [];
  private currentId: string = null;
  categories: Category[] = [];

  constructor() {
    this.temp = this.initialize();
  }

  /* document functions */
  addCategory(category: Category) {
    if (this.categories.every((c) => c.inputValue !== category.inputValue)) {
      this.categories.push({
        inputValue: category.inputValue,
        caption: "",
      });
    }
    this.categories = this.save(this.CATEGORY_STORAGE_NAME, this.categories);
  }

  removeCategory(index: number) {
    this.categories.splice(index, 1);
    this.categories = this.save(this.CATEGORY_STORAGE_NAME, this.categories);
  }

  currentMinutes(id: string) {
    this.currentId = id;
  }

  add(minutes: Minutes) {
    this.temp.push(minutes);
    this.save(this.STORAGE_NAME, this.temp);
  }

  update(id: string, minutes: Minutes) {
    const index = this.temp.findIndex((tmp) => tmp.id === id);
    this.temp.splice(index, 1, minutes);
    this.save(this.STORAGE_NAME, this.temp);
  }

  remove(id: string) {
    this.temp = this.temp.filter((tmp) => tmp.id !== id);
    this.temp = this.save(this.STORAGE_NAME, this.temp);
  }

  /* storage functions */
  initialize() {
    if (!this.has(this.STORAGE_NAME)) {
      this.temp = this.save(this.STORAGE_NAME, this.temp);
    }
    if (!this.has(this.CATEGORY_STORAGE_NAME)) {
      this.categories = this.save(this.CATEGORY_STORAGE_NAME, this.categories);
    }
    this.temp = (this.load(this.STORAGE_NAME) as Minutes[]).map(
      (m) => new Minutes(m)
    );
    this.loadCategories();
    return this.findAll();
  }

  has(storageKey: string) {
    return storageKey in localStorage;
  }

  load(key: string) {
    const storage = localStorage.getItem(key);
    return JSON.parse(storage);
  }

  loadCategories() {
    const categories = this.load(this.CATEGORY_STORAGE_NAME);
    this.categories = this.temp.reduce((acc, cur) => {
      if (cur.category && acc.every((a) => a.inputValue !== cur.category)) {
        acc.push({
          caption: "",
          inputValue: cur.category,
        });
      }
      return acc;
    }, categories as Category[]);
  }

  findAll() {
    return this.temp;
  }

  findOne(id: string) {
    return this.temp.find((tmp) => tmp.id === id);
  }

  findByTime(startTime: Date, endTime: Date) {
    const sTime = format(startTime, "YYYY-MM-ddTHH:mm:ss.SSS");
    const eTime = format(endTime, "YYYY-MM-ddTHH:mm:ss.SSS");
    return this.temp.filter(
      (minutes) => sTime <= minutes.createdAt && minutes.createdAt <= eTime
    );
  }

  save(key: string, value: Minutes[] | Category[]) {
    this.version += 1;
    if (value instanceof Array && value[0] instanceof Minutes) {
      value = (value as Minutes[]).map((v) => {
        if (!("category" in v) || !v.category) {
          v.category = "미지정";
        }
        return v;
      });
    }
    localStorage.setItem(key, JSON.stringify(value));
    return this.load(key);
  }

  upload(result: Minutes[]) {
    const origins = (this.load(this.STORAGE_NAME) as Minutes[]).map(
      (m) => new Minutes(m)
    );
    const uploaded = result.map((m) => new Minutes(m));
    this.temp = [...origins, ...uploaded].reduce((acc, cur) => {
      if (acc.every((a) => a.id !== cur.id)) {
        acc.push(cur);
      }
      return acc;
    }, []);
    this.temp = this.save(this.STORAGE_NAME, this.temp);
  }

  saveAll() {
    this.temp = this.save(this.STORAGE_NAME, this.temp);
    this.categories = this.save(this.CATEGORY_STORAGE_NAME, this.categories);
  }

  clearAllDocuments() {
    this.temp = this.save(this.STORAGE_NAME, []);
  }
}
