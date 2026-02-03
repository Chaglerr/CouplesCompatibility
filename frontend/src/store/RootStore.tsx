import {createContext, ReactNode} from 'react';

export class RootStore {
  constructor() {}
}

const ROOT_STORE = new RootStore();
// eslint-disable-next-line react-refresh/only-export-components
export const RootStoreContext = createContext(ROOT_STORE);

export const RootStoreProvider = ({children}: {children: ReactNode}) => {
  return (
    <RootStoreContext.Provider value={ROOT_STORE}>{children}</RootStoreContext.Provider>
  );
};
