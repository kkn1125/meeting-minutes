const MODE = import.meta.env.DEV ? "development" : "production";
export const BASE = MODE === "production" ? "/meeting-minutes/" : "/";
