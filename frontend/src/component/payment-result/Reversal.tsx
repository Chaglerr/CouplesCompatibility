import {useContext, useEffect} from 'react';
import {RootUiStoreContext} from '../../store/RootUiStore.tsx';
import translate from '../../locale/message.ts';

export const Reversal = () => {
  const rootUiStore = useContext(RootUiStoreContext);
  const englishTextClassname = rootUiStore.locale === 'ka' ? '' : 'visby-font';

  const currentLanguage = rootUiStore.locale;

  const button =
    currentLanguage === 'ka' ? './resources/back_geo.png' : './resources/back_en.png';

  const buttonOnClick = () => {
    rootUiStore.setAppState('wash-selection');
  };

  const timeoutMs = parseInt(import.meta.env.VITE_DEFAULT_TIMEOUT || '10000');

  useEffect(() => {
    const timer = setTimeout(() => {
      rootUiStore.reset();
    }, timeoutMs);

    return () => clearTimeout(timer);
  }, [rootUiStore, timeoutMs]);

  return (
    <div
      className="w-full h-full flex flex-column align-items-center justify-content-between "
      style={{
        backgroundColor: 'var(--main-bg)',
      }}
    >
      <img src={'./resources/driwo_dark.svg'} alt="driwo-logo" />
      <div className="flex-column flex align-items-center justify-content-center gap-5">
        <img src={button} alt={'back'} onClick={buttonOnClick} width={512} />

        <span
          style={{
            color: 'var(--main-text)',
            fontSize: '85px',
            fontWeight: 'bold',
            textTransform: 'uppercase',
            textAlign: 'center',
          }}
        >
          {translate('moneyWillBeReturned')}
        </span>
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
