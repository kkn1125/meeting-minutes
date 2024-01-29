function isMobile() {
    //@ts-ignore
    var mobile = self.navigator.userAgentData.mobile;
    return mobile;
}
self.addEventListener("notificationclick", function (e) {
    sendToMain(e.notification);
    e.notification.close();
    // 알림 클릭 시 필요한 동작을 추가할 수 있습니다.
});
self.addEventListener("message", function (event) {
    if (event.data) {
        var _a = event.data, type = _a.type, data = _a.data;
        var title_1 = data.title, body_1 = data.body, icon_1 = data.icon, id_1 = data.id;
        // console.log("서비스 워커가 메시지를 받았습니다: ", {
        //   ...data,
        // });
        self.clients.matchAll().then(function (clients) {
            clients.forEach(function (client) {
                client.postMessage({
                    type: "worker",
                    action: "todo/rerender",
                    data: {
                        title: title_1,
                        body: body_1,
                        icon: icon_1,
                        id: id_1,
                    },
                });
            });
        });
        event.waitUntil(self.registration
            .showNotification(title_1, {
            body: body_1,
            icon: icon_1,
            data: { id: id_1 },
            tag: String(Date.now()),
        })
            .then(function () {
            // (self as any).registration.getNotifications().then((values) => {
            //   if (!isMobile()) {
            //     setTimeout(() => {
            //       const notification = values[values.length - 1];
            //       notification.close();
            //     }, 5000);
            //   }
            // });
        }));
    }
});
function sendToMain(notification) {
    var title = notification.title, body = notification.body, icon = notification.icon, data = notification.data;
    if (data.id) {
        self.clients.matchAll().then(function (clients) {
            clients.forEach(function (client) {
                client.postMessage({
                    type: "worker",
                    action: "todo/view",
                    data: { title: title, body: body, icon: icon, id: data.id },
                });
            });
        });
    }
}
