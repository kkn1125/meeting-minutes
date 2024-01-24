export const MODE = import.meta.env.DEV;
export const BASE = MODE ? "/" : "/meeting-minutes/";
export const todoQueue = [];
export const todoTimeoutQueue: number[] = [];
