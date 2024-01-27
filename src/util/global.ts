export const VITE_MODE = import.meta.env.VITE_MODE || "production";
export const MODE = import.meta.env.MODE === "production";
export const BASE =
  VITE_MODE === "local" ? "/" : MODE ? "/meeting-minutes/" : "/";
export const todoQueue = [];
export const todoTimeoutQueue: number[] = [];
