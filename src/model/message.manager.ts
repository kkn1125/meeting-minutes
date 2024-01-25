import { DocumentationManager } from "./documentation.manager";
import Timestamp from "./timestamp";

export default class MessageManager {
  timerLoop: number;
  before: number = 0;
  docuManager: DocumentationManager;

  constructor() {
    this.destroy();
  }

  setDocumentationManager(docuManager: DocumentationManager) {
    this.docuManager = docuManager;

    this.startManagement();
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
              notification.notification(2);
            }
            if (
              notification.ended === false &&
              notification.isEndTimeOrPassed()
            ) {
              notification.notifyEnd();
              notification.notification(3);
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

  destroy() {
    cancelAnimationFrame(this.timerLoop);
  }
}

export const messageManager = new MessageManager();
