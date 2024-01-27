var pushNotification;
if (!pushNotification) {
    document.addEventListener("deviceready", onDeviceReady, false);
    function onDeviceReady() {
        // @ts-ignore
        pushNotification = window.plugins.pushNotification;
        setupNotificationsForandroid();
    }
}
//begin setup
function setupNotificationsForandroid() {
    //  alert("inside setup");
    if (
    // @ts-ignore
    device.platform == "android" ||
        // @ts-ignore
        device.platform == "Android" ||
        // @ts-ignore
        device.platform == "amazon-fireos") {
        pushNotification.register(successHandler, errorHandler, {
            senderID: "856763042820",
            ecb: "onNotification",
        });
    }
    else {
        pushNotification.register(tokenHandler, errorHandler, {
            badge: "true",
            sound: "true",
            alert: "true",
            ecb: "onNotificationAPN",
        });
    }
}
function tokenHandler() { }
function successHandler(result) {
    //alert("success"+result);
}
function errorHandler() {
    alert("error");
}
// Android
function onNotification(e) {
    //alert("inside onnotification");
    switch (e.event) {
        case "registered":
            if (e.regid.length > 0) {
                //set up the server call for storing registraion ids
                alert(e.regid);
            }
            break;
        case "message":
            // if this flag is set, this notification happened while we were in the foreground.
            if (e.foreground) {
                // @ts-ignore
                var soundfile = e.soundname || e.payload.sound;
                // @ts-ignore
                var my_media = new Media("android/assets/www/" + soundfile);
                my_media.play();
            }
            else {
                // otherwise we were launched because the user touched a notification in the notification tray.
            }
            break;
        case "error":
            console.log("Error" + e.msg);
            break;
        default:
            console.log("An unknown event");
            return;
    }
}
function isMobile() {
    //@ts-ignore
    var mobile = self.navigator.userAgentData.mobile;
    return mobile;
}
// self.addEventListener("push", function (event) {
//   if ((event as any).data) {
//     const data = (event as any).data?.json() ?? {};
//     // console.log(data);
//     const options = {
//       body: data.body,
//       icon: data.icon,
//       // 다른 알림 옵션을 추가할 수 있습니다.
//     };
//     (event as any).waitUntil(
//       (self as any).registration.showNotification(data.title, options)
//     );
//   }
// });
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
        if (process.env.NODE_ENV === "local") {
            //@ts-ignore
            navigator.notification.alert(body_1, function () { }, title_1);
        }
        else {
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
