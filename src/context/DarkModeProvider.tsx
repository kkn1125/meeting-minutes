import { ThemeProvider, createTheme } from "@mui/material/styles";
import {
  ReactElement,
  createContext,
  useMemo,
  useReducer,
  useState,
} from "react";

const defaultThemeMode =
  (localStorage.getItem("theme/mode") as "dark" | "light") || "light";

const initializeValue = {
  mode: defaultThemeMode,
};

export const ThemeContext = createContext(initializeValue);
export const ThemeDispatchContext = createContext(new Function());
export const ColorModeContext = createContext({
  mode: () => defaultThemeMode,
  toggleColorMode: () => {},
});

export enum MODE_ACTION {
  LIGHT = "mode/light",
  DARK = "mode/dark",
}

const reducer = (state, action) => {
  switch (action.type) {
    case MODE_ACTION.DARK:
      localStorage.setItem("theme/mode", "dark");
      return { ...state, mode: "dark" };
    case MODE_ACTION.LIGHT:
      localStorage.setItem("theme/mode", "light");
      return { ...state, mode: "light" };
    default:
      return state;
  }
};

type DarkModeProviderProps = {
  children: ReactElement | ReactElement[];
};

function DarkModeProvider({ children }: DarkModeProviderProps) {
  const [mode, setMode] = useState<"light" | "dark">(defaultThemeMode);
  const [state, dispatch] = useReducer(reducer, initializeValue);
  const colorMode = useMemo(
    () => ({
      mode: () => mode,
      toggleColorMode: () => {
        dispatch({
          type: state.mode === "light" ? MODE_ACTION.DARK : MODE_ACTION.LIGHT,
        });
        setMode((prevMode) => {
          const mode = prevMode === "light" ? "dark" : "light";
          return mode;
        });
      },
    }),
    [state.mode]
  );
  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: state.mode,
        },
      }),
    [state.mode]
  );
  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <ThemeDispatchContext.Provider value={dispatch}>
          <ThemeContext.Provider value={state}>
            {children}
          </ThemeContext.Provider>
        </ThemeDispatchContext.Provider>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default DarkModeProvider;
