import './washselection.css';
import {observer} from 'mobx-react-lite';
import translate from '../../locale/message.ts';
import {PlateNumber} from '../plate-number/PlateNumber.tsx';
import {WashDetailsComponent} from './WashDetailsComponent.tsx';
import {ChangeLanguageButton} from './ChangeLanguageButton.tsx';
import {RootUiStoreContext} from '../../store/RootUiStore.tsx';
import {useContext, useEffect, useState} from 'react';
import {RootStoreContext} from '../../store/RootStore.tsx';
import {useWebSocketContext} from '../landing/WebSocketContext.tsx';

export const WashSelection = observer(() => {
  const rootUiStore = useContext(RootUiStoreContext);

  const rootStore = useContext(RootStoreContext);
  const washSelectionStore = rootStore.washSelectionStore;

  const timeoutMs = parseInt(import.meta.env.VITE_WASH_SELECTION_TIMEOUT || '300000');

  useEffect(() => {
    const timer = setTimeout(() => {
      rootUiStore.reset();
    }, timeoutMs);

    return () => clearTimeout(timer);
  }, [rootUiStore, timeoutMs]);

  useEffect(() => {
    rootUiStore.setIsCancelled(false);
    if (washSelectionStore.washDetails.length === 0) {
      // CC300HH DD009MM
      washSelectionStore.getWashDetails(rootUiStore.licensePlate);
    }
  }, [rootUiStore, washSelectionStore]);

  const percentage = washSelectionStore.discountAmount || '';
  const discountFontSize = percentage.length < 3 ? '100px' : '90px';

  const onClickWashDetails = (index: number) => {
    const washDetails = washSelectionStore.washDetails[index - 1];
    const washPrice = washDetails ? washDetails.washPrice : 0;
    rootUiStore.setChosenWashAmount(washPrice);
    rootUiStore.setChosenWashDuration(washDetails ? washDetails.washDuration : 0);
    rootUiStore.setChosenWashIndex(index);
    if (washSelectionStore.hasDiscount) {
      rootUiStore.setChosenWashDiscountedPrice(
        washDetails ? washDetails.discountedPrice : 0
      );
    }
    if (
      !washSelectionStore.hasDiscount &&
      !rootUiStore.inCorrectAfterRetry &&
      rootUiStore.licensePlate !== 'unknown'
    ) {
      rootUiStore.setAppState('leave-number-discount');
    } else {
      rootUiStore.setAppState('payment-selection');
    }
  };

  const isValidDiscount =
    washSelectionStore.hasDiscount &&
    washSelectionStore.discountAmount &&
    washSelectionStore.discountAmount.length > 0 &&
    !washSelectionStore.discountAmount.startsWith('0');

  return (
    <div
      className="w-full h-full flex flex-column align-items-center justify-content-evenly"
      style={{backgroundColor: 'var(--main-bg)'}}
    >
      <img src={'./resources/driwo_dark.svg'} alt="driwo-logo" />

      {isValidDiscount && (
        <>
          <img
            src={'./resources/sale_tag.svg'}
            alt={'sale-tag'}
            width={300}
            height={230}
            style={{
              position: 'absolute',
              top: '130px',
              right: '70px',
              zIndex: 10,
            }}
          />

          <span
            style={{
              color: 'white',
              fontSize: discountFontSize,
              fontWeight: 'bold',
              transform: 'rotate(18deg)',
              position: 'absolute',
              top: '190px',
              right: '105px',
              zIndex: 11,
            }}
            className="qafi-font"
          >
            -{washSelectionStore.discountAmount}
          </span>
        </>
      )}

      <span
        style={{
          color: 'var(--main-text)',
          fontSize: '112px',
          fontWeight: 'bold',
          textTransform: 'uppercase',
        }}
      >
        {translate('hello')}
      </span>

      <PlateNumber />

      <span
        style={{
          color: 'var(--main-text)',
          fontSize: '86px',
          fontWeight: 'bold',
          textTransform: 'uppercase',
        }}
      >
        {translate('chooseWashType')}
      </span>

      <div className="w-full flex align-items-center justify-content-evenly">
        <WashDetailsComponent
          washDetails={washSelectionStore.washDetails[0]}
          timeIconPath={'./resources/time_small.svg'}
          onClick={() => {
            onClickWashDetails(1);
          }}
          hasDiscount={washSelectionStore.hasDiscount}
        />
        <WashDetailsComponent
          washDetails={washSelectionStore.washDetails[1]}
          timeIconPath={'./resources/time_mid.svg'}
          onClick={() => {
            onClickWashDetails(2);
          }}
          hasDiscount={washSelectionStore.hasDiscount}
        />
        <WashDetailsComponent
          washDetails={washSelectionStore.washDetails[2]}
          timeIconPath={'./resources/longest.svg'}
          onClick={() => {
            onClickWashDetails(3);
          }}
          hasDiscount={washSelectionStore.hasDiscount}
        />
      </div>
      <WashSelectionsFooter />
    </div>
  );
});

const WashSelectionsFooter = () => {
  const rootUiStore = useContext(RootUiStoreContext);
  const rootStore = useContext(RootStoreContext);
  const washSelectionStore = rootStore.washSelectionStore;
  const hasDiscount = washSelectionStore.hasDiscount;

  const englishTextClassname = rootUiStore.locale === 'ka' ? 'qafi-font' : 'visby-font';

  const [helpClicked, setHelpClicked] = useState(false);

  const {retryPlateDetection, isRetrying} = useWebSocketContext();

  const getIncorrectPlateButton = () => {
    if (!rootUiStore.hasRetried) {
      return (
        <button
          className="payment-methods-container"
          style={{border: 'none'}}
          onClick={() => {
            retryPlateDetection();
            rootUiStore.setInCorrectAfterRetry(false);
            rootUiStore.setHasRetried(true);
          }}
          disabled={isRetrying}
        >
          <span
            className={`${englishTextClassname}`}
            style={{
              width: '200px',
              fontSize: '20px',
              textAlign: 'left',
              color: 'var(--tertiary-text-color)',
              fontWeight: 'bold',
              marginTop: '5px',
            }}
          >
            {translate('wrongPlate')}
          </span>
          <img
            src={'./resources/retry_icon.svg'}
            alt={'retry-icon'}
            width={35}
            height={35}
          />
        </button>
      );
    }
    return (
      <button
        className={'payment-methods-container'}
        style={{border: 'none', background: 'var(--tertiary-text-color)'}}
        onClick={() => {
          rootUiStore.setInCorrectAfterRetry(true);
          setHelpClicked(true);
        }}
      >
        <span
          className={`${englishTextClassname}`}
          style={{
            color: 'white',
            fontSize: '36px',
            textAlign: 'center',
            fontWeight: 'bold',
            marginTop: '5px',
          }}
        >
          {translate('help')}
        </span>
      </button>
    );
  };

  const firstTwoElements = () => {
    return (
      <>
        {hasDiscount ? (
          <div className="payment-methods-container">
            <img
              src="./resources/card_only.svg"
              alt="card_only"
              style={{width: '54px', height: '43px'}}
            />
            <span className={`${englishTextClassname} payment-methods-text`}>
              {translate('cardOnly')}
            </span>
          </div>
        ) : (
          getIncorrectPlateButton()
        )}
        <PaymentMethods />
      </>
    );
  };

  const helpPhoneNumber = import.meta.env.VITE_HELP_PHONE_NUMBER || '1234567890';

  return (
    <div className="w-full flex align-items-center justify-content-evenly">
      {!helpClicked ? (
        firstTwoElements()
      ) : (
        <div
          style={{
            height: '70px',
            width: '624px',
            border: 'none',
            background: 'var(--tertiary-text-color)',
            borderRadius: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'start',
          }}
        >
          <span
            className={`${englishTextClassname}`}
            style={{
              color: 'white',
              fontSize: '20px',
              textAlign: 'left',
              fontWeight: 'bold',
              marginTop: '5px',
              width: '416px',
              marginLeft: '40px',
            }}
          >
            {translate('messageForHelp') + ' ' + helpPhoneNumber}
          </span>
        </div>
      )}
      <ChangeLanguageButton />
    </div>
  );
};

const PaymentMethods = () => {
  return (
    <div className="payment-methods-container">
      <img
        src="./resources/visa.svg"
        alt="visa"
        style={{width: '80px', height: '17px'}}
      />

      <img
        src="./resources/mastercard.svg"
        alt="mastercard"
        style={{width: '45px', height: '28px', marginLeft: '-7px'}}
      />

      <img
        src="./resources/amex.svg"
        alt="amex"
        style={{width: '47px', height: '30px'}}
      />

      <img
        src="./resources/g_apple_pay.png"
        alt={'apple-pay'}
        style={{width: '47px', height: '43px'}}
      />
    </div>
  );
};
