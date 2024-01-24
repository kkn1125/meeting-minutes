import { ReactElement, createContext, useReducer } from "react";
import { docuManager } from "../model/documentation.manager";

const documentation = docuManager.documentation;

const initializeValue = {
  data: {
    minutes: [],
    todos: [],
  },
  version: 0,
};

export const DataContext = createContext(initializeValue);
export const DataDispatchContext = createContext(new Function());

export enum DATA_ACTION {
  LOAD = "data/load",
  CB = "data/callback",
}

const reducer = (state, action) => {
  switch (action.type) {
    case DATA_ACTION.LOAD:
      import.meta.env.DEV && console.log("load update");
      return {
        data: {
          minutes: [...docuManager.findAll()],
          todos: [...docuManager.todoManager.findAll()],
        },
        version: state.version + 1,
      };
    case DATA_ACTION.CB:
      action.cb();
      return { ...state, version: state.version + 1 };
    default:
      return { ...state, version: state.version + 1 };
  }
};

type DataProviderProps = {
  children: ReactElement | ReactElement[];
};

function DataProvider({ children }: DataProviderProps) {
  const [state, dispatch] = useReducer(reducer, initializeValue);

  return (
    <DataDispatchContext.Provider value={dispatch}>
      <DataContext.Provider value={state}>{children}</DataContext.Provider>
    </DataDispatchContext.Provider>
  );
}

export default DataProvider;
