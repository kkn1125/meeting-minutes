import { app, BrowserWindow } from "electron/main";
import path from "node:path";
import url from "node:url";

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    // webPreferences: {
    //   preload: path.join(path.resolve(), "preload.js"),
    // },
  });

  const startUrl =
    process.env.ELECTRON_START_URL ||
    url.format({
      pathname: path.join(path.resolve(), "dist2/index.html"),
      protocol: "file:",
      slashes: true,
    });
  console.log("startUrl", startUrl);
  win.loadURL(startUrl);
}

app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
