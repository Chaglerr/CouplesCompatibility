import {WashSelectionStore} from './wash-selection-store.ts';
import {WashSelectionService} from '../service/wash-selection-service.ts';
import {createContext, ReactNode} from 'react';
import {PaymentStore} from './payment-store.ts';
import {PaymentService} from '../service/payment-service.ts';

export class RootStore {
  washSelectionStore: WashSelectionStore;
  paymentStore: PaymentStore;

  constructor() {
    this.washSelectionStore = new WashSelectionStore(new WashSelectionService());
    this.paymentStore = new PaymentStore(new PaymentService());
  }
}

const ROOT_STORE = new RootStore();
// eslint-disable-next-line react-refresh/only-export-components
export const RootStoreContext = createContext(ROOT_STORE);

export const RootStoreProvider = ({children}: {children: ReactNode}) => {
  return (
    <RootStoreContext.Provider value={ROOT_STORE}>{children}</RootStoreContext.Provider>
  );
};
