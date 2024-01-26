import { pushMessage } from "../util/features";
import { DocumentationManager } from "./documentation.manager";
import Timestamp from "./timestamp";
import Todo from "./todo";

export const NOTIFICATE_LEVEL: ["등록", "수정", "시작", "종료"] = [
  "등록",
  "수정",
  "시작",
  "종료",
];
export type NotificationLevel = 0 | 1 | 2 | 3;
export default class MessageManager {
  timerLoop: number;
  before: number = 0;
  docuManager: DocumentationManager;
  // consumerTimer: number | NodeJS.Timer;
  // messageQueue: (() => void)[] = [];

  constructor() {
    this.destroy();
  }

  setDocumentationManager(docuManager: DocumentationManager) {
    this.docuManager = docuManager;

    this.startManagement();
  }

  notification(todo: Todo, level: NotificationLevel) {
    // this.messageQueue.push(() => {
    // });
    pushMessage(
      `[${NOTIFICATE_LEVEL[level]}] ` + todo.title,
      todo.content,
      todo.id
    );
  }

  startManagement() {
    const now = new Timestamp();
    const afterTime = new Timestamp();
    afterTime.add({ second: 1 });
    afterTime.removeMs();
    const getStartTime = afterTime.getTime() - now.getTime();
    let managerLoop: number;
    function manager(time: number) {
      managerLoop = requestAnimationFrame(manager.bind(this));
      if (getStartTime <= time) {
        cancelAnimationFrame(managerLoop);
        this.timerLoop = requestAnimationFrame(this.timer.bind(this));
      }
    }
    managerLoop = requestAnimationFrame(manager.bind(this));
  }

  timer(time: number) {
    this.timerLoop = requestAnimationFrame(this.timer.bind(this));
    time = time * 0.001;
    const now = Math.floor(time);
    if (this.before !== now) {
      if (this.docuManager) {
        const notificationCandidates =
          this.docuManager.todoManager.getNotifications();
        // console.log(notificationCandidates);
        if (notificationCandidates.length > 0) {
          notificationCandidates.forEach((notification) => {
            if (notification.started === false && notification.isStartTime()) {
              this.notification(notification, 2);
            }
            if (
              notification.ended === false &&
              notification.isEndTimeOrPassed()
            ) {
              notification.notifyEnd();
              this.notification(notification, 3);
              notification.finish();
              this.docuManager.todoManager.update(
                notification.id,
                notification
              );
              this.docuManager.todoManager.saveAll();
            }
          });
        }
      }
    }
    this.before = now;
  }

  // consumer() {
  //   import.meta.env.DEV && console.log("consumer start");
  //   this.consumerTimer = setInterval(() => {
  //     if (this.messageQueue.length > 0) {
  //       const nofitication = this.messageQueue.shift();
  //       nofitication?.();
  //     }
  //   }, 50);
  // }

  destroy() {
    // clearInterval(this.consumerTimer as number);
    cancelAnimationFrame(this.timerLoop);
  }
}

export const messageManager = new MessageManager();
