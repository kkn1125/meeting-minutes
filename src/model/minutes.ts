import { v4 } from "uuid";
import { format } from "../util/features";

export type Content = {
  item: string;
};
export type AutoComplete = {
  name: string;
};

export interface MinutesType {
  id: string;
  category: string;
  title: string;
  topic: string;
  minutesDate: string;
  participants: AutoComplete[];
  contents: Content[];
  note: string;
  createdAt: string;
  updatedAt: string;
}

export interface InitialValues
  extends Omit<MinutesType, "createdAt" | "updatedAt" | "id"> {}

export interface UpdateValues extends Omit<MinutesType, "updatedAt"> {}

export default class Minutes {
  id: string;
  category: string;
  title: string;
  topic: string;
  minutesDate: string;
  participants: AutoComplete[];
  contents: Content[];
  note: string;
  createdAt: string;
  updatedAt: string;

  constructor();
  constructor(minutes: InitialValues);
  constructor(minutes: MinutesType);
  constructor(minutes?: Partial<InitialValues & MinutesType>) {
    const currentTime = format(new Date(), "YYYY-MM-ddTHH:mm:ss.SSS");
    if (minutes) {
      const {
        id,
        category,
        title,
        topic,
        minutesDate,
        participants,
        contents,
        note,
        createdAt,
        updatedAt,
      } = minutes;
      this.id = id || v4();
      this.category = category;
      this.title = title;
      this.topic = topic;
      this.minutesDate = minutesDate;
      this.participants = participants;
      this.contents = contents.filter((content) => content.item.length > 0);
      this.note = note;
      this.createdAt = createdAt || currentTime;
      this.updatedAt = updatedAt || currentTime;
    }
  }
  update(updateMinutes: UpdateValues) {
    const currentTime = format(new Date(), "YYYY-MM-ddTHH:mm:ss.SSS");
    this.id = updateMinutes.id;
    this.category = updateMinutes.category;
    this.title = updateMinutes.title;
    this.topic = updateMinutes.topic;
    this.minutesDate = updateMinutes.minutesDate;
    this.participants = updateMinutes.participants;
    this.contents = updateMinutes.contents;
    this.note = updateMinutes.note;
    this.createdAt = updateMinutes.createdAt;
    this.updatedAt = currentTime;
  }
  toItem() {
    return {
      id: this.id,
      category: this.category,
      title: this.title,
      topic: this.topic,
      minutesDate: this.minutesDate,
      participants: this.participants,
      contents: this.contents,
      note: this.note,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
