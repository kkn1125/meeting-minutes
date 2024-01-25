import React, { ReactElement, createContext, useReducer } from "react";
import {
  DocumentationManager,
  docuManager,
} from "../model/documentation.manager";

export const initialDocumentValue = docuManager;

export const DocumentContext = createContext(initialDocumentValue);
export const DocumentDispatchContext = createContext(new Function());

export type DocumentActionType = {
  type: DOCUMENT_ACTION;
};

export enum DOCUMENT_ACTION {
  LOAD = "document/load",
}

const reducer = (state: DocumentationManager, action: DocumentActionType) => {
  switch (action.type) {
    case DOCUMENT_ACTION.LOAD:
      return state;
    default:
      return state;
  }
};

export type DOcumentProviderProps = {
  children: ReactElement;
};

function DocumentProvider({ children }: DOcumentProviderProps) {
  const [state, dispatch] = useReducer(reducer, initialDocumentValue);

  return (
    <DocumentDispatchContext.Provider value={dispatch}>
      <DocumentContext.Provider value={state}>
        {children}
      </DocumentContext.Provider>
    </DocumentDispatchContext.Provider>
  );
}

export default DocumentProvider;
