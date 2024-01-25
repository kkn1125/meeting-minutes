import { ReactElement, createContext, useEffect, useReducer } from "react";
import {
  DocumentationManager,
  docuManager,
} from "../model/documentation.manager";
import MessageManager, { messageManager } from "../model/message.manager";

export const initialMessageValue = messageManager;

export const MessageContext = createContext(initialMessageValue);
export const MessageDispatchContext = createContext(new Function());

export type MessageActionType = {
  type: MESSAGE_ACTION;
  docuManager: DocumentationManager;
};

export enum MESSAGE_ACTION {
  SET_DOCU = "message/setdocu",
}

const reducer = (state: MessageManager, action: MessageActionType) => {
  switch (action.type) {
    case MESSAGE_ACTION.SET_DOCU:
      state.setDocumentationManager(action.docuManager);
      return state;
    default:
      return state;
  }
};

type MessageProviderProps = {
  children: ReactElement;
};

function MessageProvider({ children }: MessageProviderProps) {
  const [state, dispatch] = useReducer(reducer, initialMessageValue);

  useEffect(() => {
    dispatch({ type: MESSAGE_ACTION.SET_DOCU, docuManager: docuManager });
  }, []);

  return (
    <MessageDispatchContext.Provider value={dispatch}>
      <MessageContext.Provider value={state}>
        {children}
      </MessageContext.Provider>
    </MessageDispatchContext.Provider>
  );
}

export default MessageProvider;
