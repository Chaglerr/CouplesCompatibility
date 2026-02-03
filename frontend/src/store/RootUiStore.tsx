import {createContext, ReactNode} from 'react';
import {observer} from 'mobx-react-lite';

export class RootUiStore {}

const ROOT_UI_STORE = new RootUiStore();

// eslint-disable-next-line react-refresh/only-export-components
export const RootUiStoreContext = createContext(ROOT_UI_STORE);

export const RootUiStoreProvider = observer(({children}: {children: ReactNode}) => {
  return (
    <RootUiStoreContext.Provider value={ROOT_UI_STORE}>
      {children}
    </RootUiStoreContext.Provider>
  );
});
