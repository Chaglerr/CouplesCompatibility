import translate from '../../locale/message.ts';
import {useCallback, useContext, useEffect, useState} from 'react';
import {RootUiStoreContext} from '../../store/RootUiStore.tsx';
import {useWashState} from './UseWashState.tsx';

export const WashInProgress = () => {
  const rootUiStore = useContext(RootUiStoreContext);
  const englishTextClassname = rootUiStore.locale === 'ka' ? '' : 'visby-font';
  const washDuration = rootUiStore.chosenWashDuration;
  const [timeRemaining, setTimeRemaining] = useState(washDuration);

  const formatTime = useCallback((seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  }, []);

  useEffect(() => {
    if (timeRemaining <= 0) {
      rootUiStore.reset();
      return;
    }

    const timer = setInterval(() => {
      setTimeRemaining(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [rootUiStore, timeRemaining]);

  useWashState();

  return (
    <div
      className="w-full h-full flex flex-column align-items-center justify-content-between"
      style={{backgroundColor: 'var(--main-bg)', marginBottom: '60px'}}
    >
      <img src={'./resources/driwo_dark.svg'} alt="driwo-logo" />

      <div
        style={{
          fontSize: '140px',
          fontWeight: 'bold',
          lineHeight: '250px',
          textAlign: 'center',
        }}
        className="visby-font"
      >
        <h1 className={`${englishTextClassname} timer-display`}>
          {formatTime(timeRemaining)}
        </h1>
      </div>

      <div
        className="w-full flex align-items-center justify-content-evenly"
        style={{marginBottom: '60px'}}
      >
        <div
          className="payment-methods-container-big"
          style={{width: '313px', height: '120px'}}
        >
          <img
            src="./resources/card_only.svg"
            alt="card_only"
            style={{width: '80px', height: '65px'}}
          />
          <span className={`${englishTextClassname} payment-methods-text-big`}>
            {translate('cardOnly')}
          </span>
        </div>
        <div
          className="payment-methods-container-big"
          style={{height: '120px', width: '606px'}}
        >
          <img
            src="./resources/visa.svg"
            alt="visa"
            style={{width: '137px', height: '29px', marginLeft: '-27px'}}
          />

          <img
            src="./resources/mastercard.svg"
            alt="mastercard"
            style={{width: '77px', height: '48px', marginLeft: '-7px'}}
          />
          <img
            src="./resources/g_apple_pay.png"
            alt={'apple-pay'}
            style={{width: '80px', height: '73px'}}
          />
          <img
            src="./resources/amex.svg"
            alt="amex"
            style={{width: '80px', height: '51px'}}
          />
        </div>
      </div>
    </div>
  );
};
