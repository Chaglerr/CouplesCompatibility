import {ProgressSpinner} from 'primereact/progressspinner';
import './waiting.css';
import translate from '../../locale/message.ts';
import {useContext, useEffect} from 'react';
import {RootUiStoreContext} from '../../store/RootUiStore.tsx';
import {RootStoreContext} from '../../store/RootStore.tsx';
import {observer} from 'mobx-react-lite';

const WaitingForPayment = observer(() => {
  const rootUiStore = useContext(RootUiStoreContext);
  const rootStore = useContext(RootStoreContext);
  const paymentStore = rootStore.paymentStore;

  useEffect(() => {
    const cancelPayment = async () => {
      try {
        await paymentStore.cancelPayment();
      } catch (error) {
        console.error('Error cancelling payment:', error);
      }
    };

    void cancelPayment();
  }, [paymentStore, rootUiStore]);

  return (
    <div className={'container'}>
      <img
        src={'./resources/driwo_gray.svg'}
        alt="driwo-logo"
        style={{marginBottom: '150px', marginTop: '350px'}}
      />
      <div className={'content'}>
        <ProgressSpinner className={'spinner'} />
        <span
          style={{
            color: 'var(--main-text)',
            fontSize: '100px',
            fontWeight: 'bold',
            whiteSpace: 'wrap',
            textAlign: 'center',
            width: '800px',
          }}
        >
          {translate('transactionInProgress')}
        </span>
        <span
          style={{
            color: 'var(--main-text)',
            fontSize: '60px',
            fontWeight: 'bold',
            whiteSpace: 'wrap',
            textAlign: 'center',
            width: '800px',
          }}
        >
          {translate('pleaseWait')}...
        </span>
      </div>
    </div>
  );
});

export default WaitingForPayment;
