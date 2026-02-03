import {BackButton} from '../payment-selection/BackButton.tsx';
import {ChangeLanguageButton} from '../wash-selection/ChangeLanguageButton.tsx';
import {ReactNode, useState, useContext} from 'react';
import translate from '../../locale/message.ts';
import {RootUiStoreContext} from '../../store/RootUiStore.tsx';
import {observer} from 'mobx-react-lite';
import {
  PhonePromoService,
  PhonePromoRequest,
  PhonePromoResponse,
} from '../../service/phone-promo-service.ts';
import {RootStoreContext} from '../../store/RootStore.tsx';
import {formatAmount} from '../format.ts';

const NumpadButton = ({
  content,
  onClick,
  bg,
}: {
  content: ReactNode;
  onClick: () => void;
  bg?: string;
}) => {
  return (
    <button
      className="visby-font"
      style={{
        width: 200,
        height: 200,
        backgroundColor: bg ?? 'white',
        borderRadius: 30,
        fontSize: 117,
        color: 'var(--primary)',
        border: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
      onClick={onClick}
    >
      {content}
    </button>
  );
};

interface NumpadProps {
  onNumberClicked: (digit: number) => void;
  onBackSpace: () => void;
  onAccept: () => void;
  isAcceptDisabled?: boolean;
}

const Numpad = ({
  onNumberClicked,
  onBackSpace,
  onAccept,
  isAcceptDisabled = false,
}: NumpadProps) => {
  const numpadRows = [];

  const NumpadRow = ({children}: {children: ReactNode}) => (
    <div className="flex w-full justify-content-between" style={{margin: '10px 0'}}>
      {children}
    </div>
  );

  for (let i = 0; i < 3; i++) {
    const row = [];
    for (let j = 0; j < 3; j++) {
      const digit = i * 3 + j + 1;
      row.push(
        <NumpadButton
          key={digit}
          content={
            <span
              className="visby-font"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginTop: '20px',
              }}
            >
              {digit.toString()}
            </span>
          }
          onClick={() => onNumberClicked(digit)}
        />
      );
    }
    numpadRows.push(<NumpadRow key={i}>{row}</NumpadRow>);
  }

  const lastRow = (
    <NumpadRow key="last-row">
      <NumpadButton
        content={
          <img
            src={'./resources/delete_icon.svg'}
            alt="delete-icon"
            style={{width: '200px', height: '200px'}}
          />
        }
        onClick={onBackSpace}
        bg={'var(--cancelled-bg)'}
      />
      <NumpadButton
        content={
          <span
            className="visby-font"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: '20px',
            }}
          >
            0
          </span>
        }
        onClick={() => onNumberClicked(0)}
      />
      <NumpadButton
        content={
          isAcceptDisabled ? (
            <div
              style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}
            >
              <span style={{color: 'white', fontSize: '30px'}}>...</span>
            </div>
          ) : (
            <img
              src={'./resources/accept_icon.svg'}
              alt="accept-icon"
              style={{width: '200px', height: '200px'}}
            />
          )
        }
        onClick={isAcceptDisabled ? () => {} : onAccept}
        bg={'var(--cancelled-bg)'}
      />
    </NumpadRow>
  );

  numpadRows.push(lastRow);

  return (
    <div className="w-full flex flex-column align-items-center justify-content-center">
      {numpadRows}
    </div>
  );
};

const PhoneNumberInput = observer(() => {
  const [number, setNumber] = useState('');
  const [marketingChecked, setMarketingChecked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const rootUiStore = useContext(RootUiStoreContext);
  const rootStore = useContext(RootStoreContext);
  const washSelectionStore = rootStore.washSelectionStore;
  const phonePromoService = new PhonePromoService();

  function getFormattedPhoneNumber(phoneNumber: string): string {
    let result = '5';
    let numberIndex = 0;

    for (let i = 0; i < 8; i++) {
      if (numberIndex < phoneNumber.length) {
        result += phoneNumber[numberIndex];
        numberIndex++;
      } else {
        result += '_';
      }
      if (i === 1 || i === 3 || i == 5) {
        result += ' ';
      }
    }

    return result;
  }

  function handleNumberClick(digit: number) {
    if (number.length >= 8) {
      return;
    }
    setNumber(prev => prev + digit.toString());
  }

  function handleBackspace() {
    if (number.length === 0) {
      return;
    }
    setNumber(prev => prev.slice(0, -1));
  }

  async function handleAccept() {
    if (number.length !== 8) {
      return;
    }

    const fullPhoneNumber = '5' + number;
    rootUiStore.setPhoneNumber(fullPhoneNumber);

    //delete dashes from license plate
    const plate = rootUiStore.licensePlate.replace(/-/g, '');
    console.log(plate);

    const phonePromoRequest: PhonePromoRequest = {
      plate: 'dd009mm',
      phone_number: fullPhoneNumber,
      agreed_to_ads: marketingChecked,
    };

    try {
      setIsLoading(true);
      console.log('Sending phone promo request:', phonePromoRequest);

      const response: PhonePromoResponse =
        await phonePromoService.getPhonePromoPrice(phonePromoRequest);
      console.log('Received phone promo response:', response);
      if (!response.has_discount) {
        rootUiStore.setAppState('payment-selection');
        return;
      }
      const discountAmount = formatAmount(response.discount_amount) || 0;
      washSelectionStore.setDiscountInfo(true, discountAmount.toString());
      const programId = rootUiStore.chosenProgramId;

      const priceInfo = response.prices.find(price => price.programId === programId);
      const discountedPrice = priceInfo ? priceInfo.washPrice : 0;
      rootUiStore.setChosenWashDiscountedPrice(discountedPrice);

      rootUiStore.setAppState('payment-selection');
    } catch (error) {
      console.error('Failed to get phone promo price:', error);
      rootUiStore.setAppState('payment-selection');
    } finally {
      setIsLoading(false);
    }
  }

  const AcceptMarketingMessage = () => (
    <div
      className="w-full flex align-items-start justify-content-between"
      style={{
        gap: '38px',
        marginTop: '49px',
      }}
    >
      <div
        style={{
          width: '60px',
          height: '60px',
          minWidth: '60px',
          minHeight: '60px',
          border: '4px solid black',
          borderRadius: '10px',
          background: 'transparent',
          position: 'relative',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        onClick={() => {
          console.log('marketing checked', !marketingChecked);
          setMarketingChecked(!marketingChecked);
        }}
      >
        {marketingChecked && (
          <img
            src={'./resources/accept_icon.svg'}
            alt="checkmark"
            style={{width: '60px', height: '60px'}}
          />
        )}
      </div>
      <span
        className="visby-font"
        style={{fontSize: '24px', color: 'var(--main-text)'}}
      >
        {translate('marketingMessage')}
      </span>
    </div>
  );

  return (
    <div
      className="flex flex-column align-items-center justify-content-center"
      style={{gap: '80px'}}
    >
      <div
        className="flex flex-column align-items-center justify-content-center visby-font"
        style={{
          backgroundColor: 'white',
          height: 200,
          width: 1018,
          borderRadius: 30,
          fontSize: 117,
          color: 'var(--primary)',
        }}
      >
        <span>{getFormattedPhoneNumber(number)}</span>
      </div>
      <div style={{width: '676px'}}>
        <Numpad
          onNumberClicked={handleNumberClick}
          onBackSpace={handleBackspace}
          onAccept={handleAccept}
          isAcceptDisabled={isLoading}
        />
        <AcceptMarketingMessage />
      </div>
    </div>
  );
});

export const PhoneNumberInputScreen = () => {
  const rootUiStore = useContext(RootUiStoreContext);

  return (
    <div
      className="w-full h-full flex flex-column align-items-center justify-content-between"
      style={{backgroundColor: 'var(--main-bg)'}}
    >
      <img src={'./resources/driwo_dark.svg'} alt="driwo-logo" />
      <PhoneNumberInput />
      <div
        className="w-full flex align-items-center justify-content-center"
        style={{gap: '438px', marginBottom: '30px'}}
      >
        <BackButton
          onClick={() => {
            rootUiStore.setAppState('leave-number-discount');
          }}
        />
        <ChangeLanguageButton />
      </div>
    </div>
  );
};
