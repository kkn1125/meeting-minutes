import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./assets/styles/install.css";
import "./assets/styles/main.scss";
import { BrowserRouter } from "react-router-dom";
import CssBaseline from "@mui/material/CssBaseline";
// import { NextUIProvider } from "@nextui-org/react";
import DarkModeProvider from "./context/DarkModeProvider.tsx";
import DataProvider from "./context/DataProvider.tsx";
import { BASE } from "./util/global.ts";

const registerServiceWorker = async () => {
  if ("serviceWorker" in navigator) {
    try {
      const registration = await navigator.serviceWorker.register(
        location.origin + `${BASE}worker.${import.meta.env.DEV ? "ts" : "js"}`,
        {
          scope: BASE,
        }
      );
      if (registration.installing) {
        console.log("Service worker installing");
      } else if (registration.waiting) {
        console.log("Service worker installed");
      } else if (registration.active) {
        console.log("Service worker active");
      }
    } catch (error) {
      console.error(`Registration failed with ${error}`);
    }
  }
};

Notification.requestPermission().then((result) => {
  // console.log(result);
  if (result === "granted") {
    navigator.serviceWorker.ready.then((registration) => {
      if (
        !("minutes-agree" in localStorage) ||
        localStorage.getItem("minutes-agree") === "false"
      ) {
        registration.showNotification("알림", {
          body: "할 일의 알림 기능이 활성화 되었습니다.",
          icon: BASE + "favicon/apple-touch-icon.png",
        });
        localStorage.setItem("minutes-agree", "true");
      }
    });
  } else if (result === "denied") {
    if (!("minutes-agree" in localStorage)) {
      localStorage.setItem("minutes-agree", "false");
      alert(
        "알림 기능이 거부되었있습니다. 활성화하시려면 주소줄 좌측을 설정해주세요."
      );
    }
  }
});

registerServiceWorker();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <>
    {/* <React.StrictMode></React.StrictMode> */}
    <CssBaseline />
    <DataProvider>
      <BrowserRouter>
        {/* <NextUIProvider> */}
        <DarkModeProvider>
          <App />
        </DarkModeProvider>
        {/* </NextUIProvider> */}
      </BrowserRouter>
    </DataProvider>
  </>
);
