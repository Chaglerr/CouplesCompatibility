import {AppState} from '../App.tsx';
import {createContext, ReactNode} from 'react';
import {observer} from 'mobx-react-lite';
import {getCurrentLanguage} from '../locale/message.ts';
import {makeAutoObservable} from 'mobx';
import {CurrencyCode, PaymentStatus} from '../service/payment-service.ts';

export class RootUiStore {
  currentAppState: AppState = 'splash';
  locale: string = getCurrentLanguage();
  licensePlate: string = '';
  phoneNumber: string = '';
  chosenWashAmount: number = 0;
  chosenWashDiscountedPrice?: number;
  chosenWashDuration: number = 0;
  currencyCode: CurrencyCode = CurrencyCode.GEL;
  chosenProgramId: number = 0;
  currentTransactionId: string = '';
  paymentStatus: string = PaymentStatus.DEFAULT;
  isCancelled: boolean = false;
  hasRetried: boolean = false;
  inCorrectAfterRetry: boolean = false;

  constructor() {
    makeAutoObservable(this);
  }

  setIsCancelled(isCancelled: boolean) {
    this.isCancelled = isCancelled;
  }

  setInCorrectAfterRetry(inCorrect: boolean) {
    this.inCorrectAfterRetry = inCorrect;
  }

  setLicensePlate(plate: string) {
    this.licensePlate = plate;
  }

  setPhoneNumber(phoneNumber: string) {
    this.phoneNumber = phoneNumber;
  }

  setHasRetried(hasRetried: boolean) {
    this.hasRetried = hasRetried;
  }

  setPaymentStatus(status: string) {
    this.paymentStatus = status;
  }

  setCurrentTransactionId(transactionId: string) {
    this.currentTransactionId = transactionId;
  }

  setCurrencyCode(code: CurrencyCode) {
    this.currencyCode = code;
  }

  setChosenWashAmount(amount: number) {
    this.chosenWashAmount = amount;
  }

  setChosenWashDiscountedPrice(price?: number) {
    console.log('Setting chosen wash amount:', price);
    this.chosenWashDiscountedPrice = price;
  }

  setChosenWashDuration(duration: number) {
    this.chosenWashDuration = duration;
  }

  setChosenWashIndex(index: number) {
    this.chosenProgramId = index;
  }

  setLocale(locale: string) {
    this.locale = locale;
  }

  setAppState(state: AppState) {
    this.currentAppState = state;
  }

  reset() {
    this.currentAppState = 'splash';
    this.phoneNumber = '';
    this.chosenWashAmount = 0;
    this.chosenProgramId = 0;
    this.currentTransactionId = '';
    this.paymentStatus = PaymentStatus.DEFAULT;
    this.isCancelled = false;
    this.hasRetried = false;
    this.inCorrectAfterRetry = false;
  }
}

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
