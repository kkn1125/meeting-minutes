function isMobile() {
  //@ts-ignore
  const mobile = self.navigator.userAgentData.mobile;
  return mobile;
}

self.addEventListener("notificationclick", function (e) {
  sendToMain((e as any).notification);
  (e as any).notification.close();
  // 알림 클릭 시 필요한 동작을 추가할 수 있습니다.
});

self.addEventListener("message", function (event) {
  if (event.data) {
    const { type, data } = event.data;
    const { title, body, icon, id } = data;
    // console.log("서비스 워커가 메시지를 받았습니다: ", {
    //   ...data,
    // });

    (self as any).clients.matchAll().then((clients) => {
      clients.forEach((client) => {
        client.postMessage({
          type: "worker",
          action: "todo/rerender",
          data: {
            title,
            body,
            icon,
            id,
          },
        });
      });
    });

    (event as any).waitUntil(
      (self as any).registration
        .showNotification(title, {
          body,
          icon,
          data: { id },
          tag: String(Date.now()),
        })
        .then(() => {
          // (self as any).registration.getNotifications().then((values) => {
          //   if (!isMobile()) {
          //     setTimeout(() => {
          //       const notification = values[values.length - 1];
          //       notification.close();
          //     }, 5000);
          //   }
          // });
        })
    );
  }
});

function sendToMain(notification: Notification) {
  const { title, body, icon, data } = notification;
  if (data.id) {
    (self as any).clients.matchAll().then((clients) => {
      clients.forEach((client) => {
        client.postMessage({
          type: "worker",
          action: "todo/view",
          data: { title, body, icon, id: data.id },
        });
      });
    });
  }
}
