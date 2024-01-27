import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import dotenv from "dotenv";

export default defineConfig(({ command, mode }) => {
  const MODE = process.env.NODE_ENV || "production";
  const env = loadEnv(mode, process.cwd(), "");

  dotenv.config({
    path: path.join(path.resolve(), ".env"),
  });
  if (MODE === "local") {
    dotenv.config({
      path: path.join(path.resolve(), ".env.local"),
    });
  }

  const HOST = process.env.HOST;
  const PORT = process.env.PORT || 5000;

  return {
    define: {
      __APP_ENV__: JSON.stringify(env.APP_ENV),
    },
    base: MODE === "production" ? "/meeting-minutes/" : "/",
    server: {
      host: HOST,
      port: +PORT,
    },
    build: {
      outDir: MODE === "production" ? "dist" : "dist2",
    },
    plugins: [react()],
  };
});
