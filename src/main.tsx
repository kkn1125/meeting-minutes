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
        "/worker.ts",
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
        Notification.requestPermission().then((result) => {
          if (result === "granted") {
            navigator.serviceWorker.ready.then((registration) => {
              // registration.showNotification("test");
              // registration.update().then((reslut) => {
              //   // console.log(result);
              // });
            });
          }
        });
      }
    } catch (error) {
      console.error(`Registration failed with ${error}`);
    }
  }
};

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
