import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./assets/styles/install.css";
import "./assets/styles/main.scss";
import { BrowserRouter } from "react-router-dom";
import CssBaseline from "@mui/material/CssBaseline";
// import { NextUIProvider } from "@nextui-org/react";
import DarkModeProvider from "./context/DarkModeProvider.tsx";
import DataProvider from "./context/DataProvider.tsx";

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
