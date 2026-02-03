import translate from '../../locale/message.ts';
import {BackButton} from './BackButton.tsx';
import {RootUiStoreContext} from '../../store/RootUiStore.tsx';
import {useContext, useEffect} from 'react';
import {ChangeLanguageButton} from '../wash-selection/ChangeLanguageButton.tsx';
import {AmountContainer} from '../shared/AmountContainer.tsx';
import {formatAmount} from '../format.ts';
import {CurrencyCode} from '../../service/payment-service.ts';

export const PaymentSelection = () => {
  const rootUiStore = useContext(RootUiStoreContext);

  const timeoutMs = parseInt(import.meta.env.VITE_CHOOSE_PAYMENT_TIMEOUT || '300000');

  useEffect(() => {
    rootUiStore.setIsCancelled(false);
    rootUiStore.setHasRetried(false);
    const timer = setTimeout(() => {
      rootUiStore.reset();
    }, timeoutMs);

    return () => clearTimeout(timer);
  }, [rootUiStore, timeoutMs]);

  const containerStyle = {
    width: '400px',
    height: '600px',
    display: 'flex',
    flexDirection: 'column' as const,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '20px',
  };

  return (
    <div
      className="w-full h-full flex flex-column align-items-center justify-content-between"
      style={{backgroundColor: 'var(--main-bg)'}}
    >
      <img src={'./resources/driwo_dark.svg'} alt="driwo-logo" />

      <span
        style={{
          color: 'var(--main-text)',
          fontSize: '93px',
          fontWeight: 'bold',
          textAlign: 'center',
          width: '971px',
          textTransform: 'uppercase',
        }}
      >
        {translate('choosePaymentMethod')}
      </span>

      <Amounts />

      <div style={{display: 'flex', gap: '30px', justifyContent: 'center'}}>
        <div
          style={{...containerStyle, gap: '41px'}}
          onClick={() => {
            rootUiStore.setAppState('payment');
            rootUiStore.setCurrencyCode(CurrencyCode.GEL);
          }}
        >
          <img src={'./resources/visa.svg'} alt={'visa'} />

          <img src="./resources/mastercard.svg" alt="mastercard" />

          <img src="./resources/amex.svg" alt="amex" />

          <img src="./resources/g_apple_pay.png" alt="google_apple_pay" />
        </div>

        <div
          style={containerStyle}
          onClick={() => {
            rootUiStore.setAppState('payment');
            rootUiStore.setCurrencyCode(CurrencyCode.PLUS);
          }}
        >
          <img src={'./resources/plus_pay.svg'} alt="plus" />
        </div>
      </div>

      <div
        className="w-full flex align-items-center justify-content-center"
        style={{gap: '438px', marginBottom: '30px'}}
      >
        <BackButton onClick={() => rootUiStore.setAppState('wash-selection')} />
        <ChangeLanguageButton />
      </div>
    </div>
  );
};

export const Amounts = () => {
  const rootUiStore = useContext(RootUiStoreContext);

  return (
    <div style={{display: 'flex', gap: '41px', justifyContent: 'center'}}>
      {rootUiStore.chosenWashDiscountedPrice &&
      rootUiStore.chosenWashDiscountedPrice > 0 ? (
        <>
          <AmountContainer
            amountData={formatAmount(rootUiStore.chosenWashDiscountedPrice)}
            textColor={'white'}
            backgroundColor={'var(--discount-yellow)'}
            isCancelled={false}
            onClick={() => {
              rootUiStore.setAppState('payment');
              rootUiStore.setCurrencyCode(CurrencyCode.GEL);
            }}
          />

          <AmountContainer
            amountData={formatAmount(rootUiStore.chosenWashAmount)}
            textColor={'var(--cancelled-text)'}
            backgroundColor={'var(--cancelled-bg)'}
            isCancelled={true}
            onClick={() => {
              rootUiStore.setAppState('payment');
              rootUiStore.setCurrencyCode(CurrencyCode.PLUS);
            }}
          />
        </>
      ) : (
        <AmountContainer
          amountData={formatAmount(rootUiStore.chosenWashAmount)}
          isCancelled={false}
          onClick={() => {
            rootUiStore.setAppState('payment');
            rootUiStore.setCurrencyCode(CurrencyCode.PLUS);
          }}
          backgroundColor={'white'}
          textColor={'var(--primary)'}
        />
      )}
    </div>
  );
};
