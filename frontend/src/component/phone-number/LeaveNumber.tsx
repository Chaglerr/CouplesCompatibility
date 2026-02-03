import {RootUiStoreContext} from '../../store/RootUiStore.tsx';
import {useContext, useEffect, useState} from 'react';
import {AmountContainer} from '../shared/AmountContainer.tsx';
import {ChangeLanguageButton} from '../wash-selection/ChangeLanguageButton.tsx';
import {RootStoreContext} from '../../store/RootStore.tsx';

export const LeaveNumber = () => {
  const mobileIconPath = './resources/mobile_icon.svg';

  const rootUiStore = useContext(RootUiStoreContext);
  const rootStore = useContext(RootStoreContext);
  const [phonePromoDiscount, setPhonePromoDiscount] = useState<number | null>(null);
  const [hasDiscount, setHasDiscount] = useState<boolean>(false);

  useEffect(() => {
    const fetchPhonePromoDiscount = async () => {
      try {
        const response = await rootStore.washSelectionStore.getPhonePromoDiscount();
        setPhonePromoDiscount(response.phonePromoDiscount);
        setHasDiscount(response.hasDiscount);
      } catch (error) {
        console.error('Failed to fetch phone promo discount:', error);
        setPhonePromoDiscount(5);
        setHasDiscount(true);
      }
    };

    void fetchPhonePromoDiscount();
  }, [rootStore]);

  const textBeforeIcon = rootUiStore.locale === 'ka' ? 'დაგვიტოვე' : 'share your';
  const textAfterIcon =
    rootUiStore.locale === 'ka'
      ? 'ნომერი და მიიღე ფასდაკლება'
      : 'number with us and get a discount';

  const informationText =
    rootUiStore.locale === 'ka'
      ? '*ნომრის დატოვებით ავტომატურად ერთვები მზარდი ფასდაკლების სისტემაში.'
      : '*By leaving your number, you are automatically enrolled in our progressive discount system';

  const noButtonText = rootUiStore.locale === 'ka' ? 'არ მინდა' : 'NO THANKS';

  const yesButtonText = rootUiStore.locale === 'ka' ? 'მინდა' : 'SURE';

  const buttonBaseStyle = {
    width: '340px',
    height: '117px',
    borderRadius: '30px',
    border: 'none',
    color: 'white',
    fontSize: '52px',
    fontWeight: 'bold',
    textAlign: 'center' as const,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  };

  const textWidth = rootUiStore.locale === 'ka' ? '690px' : '860px';

  return (
    <div
      className="w-full h-full flex flex-column align-items-center justify-content-evenly"
      style={{backgroundColor: 'var(--main-bg)'}}
    >
      <img src={'./resources/driwo_dark.svg'} alt="driwo-logo" />

      <div style={{width: textWidth, textAlign: 'center'}}>
        <span
          style={{
            color: 'var(--main-text)',
            fontSize: '102px',
            fontWeight: 'bold',
            textTransform: 'uppercase',
          }}
        >
          {textBeforeIcon}
        </span>
        <img
          src={mobileIconPath}
          alt={'mobile'}
          width={'77px'}
          height={'116px'}
          style={{margin: '0 30px', verticalAlign: 'top'}}
        />
        <span
          style={{
            color: 'var(--main-text)',
            fontSize: '102px',
            fontWeight: 'bold',
            textTransform: 'uppercase',
          }}
        >
          {textAfterIcon}
        </span>
      </div>

      <AmountContainer
        amountData={
          hasDiscount && phonePromoDiscount ? `-${phonePromoDiscount}₾` : '-5₾'
        }
        textColor={'white'}
        backgroundColor={'var(--discount-yellow)'}
        isCancelled={false}
      />

      <span
        style={{
          color: 'var(--main-text)',
          fontSize: '36px',
          textAlign: 'center',
          width: '644px',
          fontWeight: 'bold',
        }}
      >
        {informationText}
      </span>

      <div
        className={'flex align-items-center justify-content-between align-self-center'}
        style={{width: '720px'}}
      >
        <div
          style={{
            ...buttonBaseStyle,
            backgroundColor: 'var(--button-black)',
          }}
          onClick={() => {
            rootUiStore.setAppState('payment-selection');
          }}
        >
          {noButtonText}
        </div>
        <div
          style={{
            ...buttonBaseStyle,
            backgroundColor: 'var(--primary)',
          }}
          onClick={() => {
            rootUiStore.setAppState('phone-number-input');
          }}
        >
          {yesButtonText}
        </div>
      </div>
      <div
        className="w-full flex align-items-center justify-content-end"
        style={{marginRight: '50px'}}
      >
        <ChangeLanguageButton />
      </div>
    </div>
  );
};
