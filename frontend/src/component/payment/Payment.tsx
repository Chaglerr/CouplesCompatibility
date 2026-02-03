import translate from '../../locale/message.ts';
import './payment.css';
import {BackButton} from '../payment-selection/BackButton.tsx';
import {RootUiStoreContext} from '../../store/RootUiStore.tsx';
import {useContext, useEffect} from 'react';
import {ChangeLanguageButton} from '../wash-selection/ChangeLanguageButton.tsx';
import {RootStoreContext} from '../../store/RootStore.tsx';
import {PaymentStatus} from '../../service/payment-service.ts';
import {Amounts} from '../payment-selection/PaymentSelection.tsx';
import {observer} from 'mobx-react-lite';

export const Payment = observer(() => {
  const rootUiStore = useContext(RootUiStoreContext);

  const price = rootUiStore.chosenWashAmount;
  const currencyCode = rootUiStore.currencyCode;
  const rootStore = useContext(RootStoreContext);
  const paymentStore = rootStore.paymentStore;
  const washSelectionStore = rootStore.washSelectionStore;
  const percentage = washSelectionStore.discountAmount || '';
  const discountFontSize = percentage.length < 3 ? '100px' : '90px';

  useEffect(() => {
    const initPayment = async () => {
      try {
        const result = await paymentStore.initiatePayment(price, currencyCode);
        rootUiStore.setCurrentTransactionId(result.transactionId);
        const status = result.result;
        rootUiStore.setPaymentStatus(status);
        if (status === PaymentStatus.SUCCESS && rootUiStore.isCancelled) {
          console.log('Payment cancelled by user');
          const autoReversalStatus = await paymentStore.autoReversal(
            rootUiStore.currentTransactionId
          );
          console.log('Auto-reversal status:', autoReversalStatus);
          rootUiStore.setPaymentStatus(autoReversalStatus);
          if (autoReversalStatus === PaymentStatus.ACCEPTED) {
            rootUiStore.setAppState('reversal');
            return;
          } else {
            rootUiStore.reset();
            return;
          }
        } else if (status === PaymentStatus.FAIL) {
          console.log('Payment failed');
          rootUiStore.setAppState('payment-result');
          return;
        }

        const washResult = await paymentStore.wash(rootUiStore.chosenProgramId);
        if (washResult === 'BUSY' || washResult === 'OUT_OF_ORDER') {
          rootUiStore.setAppState('out-of-order');
          return;
        }
        rootUiStore.setAppState('payment-result');
      } catch (error) {
        console.error('Payment process failed:', error);
        return;
      }
    };

    void initPayment();
  }, [currencyCode, paymentStore, price, rootUiStore]);

  const handleBackButtonClick = () => {
    rootUiStore.setAppState('waiting-screen');
    rootUiStore.setIsCancelled(true);
  };

  const isValidDiscount =
    washSelectionStore.hasDiscount &&
    washSelectionStore.discountAmount &&
    washSelectionStore.discountAmount.length > 0 &&
    !washSelectionStore.discountAmount.startsWith('0');

  const {locale} = useContext(RootUiStoreContext);

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
          fontSize: '93px',
          fontWeight: 'bold',
          whiteSpace: 'wrap',
          width: '700px',
          textAlign: 'center',
          textTransform: 'uppercase',
        }}
        key={locale}
      >
        {translate('totalPrice')}
      </span>

      <Amounts />

      <div
        style={{
          width: '958px',
          height: '889px',
          backgroundColor: 'white',
          borderRadius: '20px',
        }}
      >
        <img
          src={'./resources/tap_card_animation.gif'}
          alt={'tap card animation'}
          className="w-full h-full"
          style={{borderRadius: '20px'}}
        />
      </div>

      <div
        className="w-full flex align-items-center justify-content-center"
        style={{gap: '438px'}}
      >
        <BackButton onClick={handleBackButtonClick} />
        <ChangeLanguageButton />
      </div>
    </div>
  );
});
