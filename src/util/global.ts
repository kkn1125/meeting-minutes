export const VITE_MODE = import.meta.env.VITE_MODE || "production";
console.log("VITE_MODE = " + VITE_MODE);
export const MODE = import.meta.env.MODE === "production";
console.log("MODE = " + MODE);
export const BASE =
  VITE_MODE === "local" ? "/" : MODE ? "/meeting-minutes/" : "/";
export const todoQueue = [];
export const todoTimeoutQueue: number[] = [];
