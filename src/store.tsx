import { createContext, ParentComponent, useContext } from "solid-js"
import {  useAppState } from "./state/appState";


const rootState = {
  app: useAppState(),
};

const StoreContext = createContext(rootState);

export const StoreProvider: ParentComponent = (props) => {
  return (
    <StoreContext.Provider value={rootState}>
      {props.children}
    </StoreContext.Provider>
  );
};

export const useSelector = () => useContext(StoreContext)!;

