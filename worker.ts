self.addEventListener("push", function (event) {
  console.log(123);
  if ((event as any).data) {
    const data = (event as any).data?.json() ?? {};
    console.log(data);
    const options = {
      body: data.body,
      icon: data.icon,
      // 다른 알림 옵션을 추가할 수 있습니다.
    };

    (event as any).waitUntil(
      (self as any).registration.showNotification(data.title, options)
    );
  }
});

self.addEventListener("notificationclick", function (e) {
  console.log(e);
  (e as any).notification.close();
  sendToMain((e as any).notification);
  // 알림 클릭 시 필요한 동작을 추가할 수 있습니다.
});

self.addEventListener("message", function (event) {
  if (event.data) {
    const { type, data } = event.data;
    const { title, body, icon, id } = data;
    console.log("서비스 워커가 메시지를 받았습니다: ", {
      ...data,
    });
    (event as any).waitUntil(
      (self as any).registration
        .showNotification(title, {
          body,
          icon,
          tag: id,
        })
        .then(() => {
          (self as any).registration.getNotifications().then((values) => {
            setTimeout(() => {
              const notification = values[values.length - 1];
              // console.log("close", notification);
              notification.close();
            }, 4000);
          });
        })
    );
  }
});

function sendToMain(notification: Notification) {
  const { title, body, icon, tag } = notification;
  (self as any).clients.matchAll().then((clients) => {
    clients.forEach((client) => {
      client.postMessage({
        type: "worker",
        action: "todo/view",
        data: { title, body, icon, tag },
      });
    });
  });
}
