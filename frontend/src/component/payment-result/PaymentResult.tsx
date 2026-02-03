import {useEffect, useContext} from 'react';
import translate from '../../locale/message.ts';
import {PlateNumber} from '../plate-number/PlateNumber.tsx';
import './payment-result.css';
import {RootUiStoreContext} from '../../store/RootUiStore.tsx';
import {PaymentStatus} from '../../service/payment-service.ts';

export const PaymentResult = () => {
  const rootUiStore = useContext(RootUiStoreContext);
  const paymentSuccessful = rootUiStore.paymentStatus === PaymentStatus.SUCCESS;

  const resultText = paymentSuccessful
    ? translate('paymentSuccessful')
    : translate('paymentFailed');
  const buttonText = paymentSuccessful ? 'go' : 'back';
  const currentLanguage = rootUiStore.locale;
  const button = paymentSuccessful
    ? currentLanguage === 'ka'
      ? './resources/go_ka.png'
      : './resources/go_en.png'
    : currentLanguage === 'ka'
      ? './resources/back_geo.png'
      : './resources/back_en.png';
  const englishTextClassname = rootUiStore.locale === 'ka' ? '' : 'visby-font';

  const buttonOnClick = () => {
    if (!paymentSuccessful) {
      rootUiStore.setAppState('wash-selection');
    }
  };

  const timeoutMs = parseInt(import.meta.env.VITE_PAYMENT_RESULT_TIMEOUT_MS || '5000');

  useEffect(() => {
    rootUiStore.setIsCancelled(false);
    const timer = setTimeout(() => {
      if (paymentSuccessful) {
        rootUiStore.setAppState('wash-in-progress');
      } else {
        rootUiStore.reset();
      }
    }, timeoutMs);

    return () => clearTimeout(timer);
  }, [paymentSuccessful, rootUiStore, timeoutMs]);

  return (
    <div
      className="w-full h-full flex flex-column align-items-center justify-content-evenly"
      style={{backgroundColor: 'var(--main-bg)'}}
    >
      <img src={'./resources/driwo_dark.svg'} alt="driwo-logo" />
      <span
        style={{
          color: 'var(--main-text)',
          fontSize: '93px',
          fontWeight: 'bold',
          textAlign: 'center',
        }}
      >
        {resultText}
      </span>

      <PlateNumber />

      <div
        className="flex flex-column align-items-center justify-content-center"
        style={{gap: '25px'}}
        onClick={buttonOnClick}
      >
        <img src={button} alt={buttonText} width={512} />

        <span
          className={englishTextClassname}
          style={{
            color: 'var(--main-text)',
            fontSize: '93px',
            fontWeight: 'bold',
            textAlign: 'center',
          }}
        >
          {paymentSuccessful ? translate('slowPace') : translate('tryAgain')}
        </span>
      </div>
    </div>
  );
};
