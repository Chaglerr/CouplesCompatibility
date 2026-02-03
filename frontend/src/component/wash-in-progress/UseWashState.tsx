import {useContext, useEffect} from 'react';
import {RootStoreContext} from '../../store/RootStore.tsx';
import {RootUiStoreContext} from '../../store/RootUiStore.tsx';
import {WashResult} from '../../service/payment-service.ts';

export const useWashState = () => {
  const rootStore = useContext(RootStoreContext);
  const washSelectionStore = rootStore.washSelectionStore;
  const rootUiStore = useContext(RootUiStoreContext);

  const timeoutMs = parseInt(import.meta.env.VITE_STATE_CHECK_INTERVAL || '60000');

  useEffect(() => {
    const pollWashState = async () => {
      try {
        const washState = await washSelectionStore.getWashState();
        console.log('Current wash state:', washState);
        if (rootUiStore.currentAppState === 'splash') {
          if (washState === WashResult.BUSY) {
            console.log('Setting app state to busy from splash');
            rootUiStore.setAppState('busy');
          } else if (washState === WashResult.OUT_OF_ORDER) {
            rootUiStore.setAppState('out-of-order');
          }
        } else if (
          rootUiStore.currentAppState === 'busy' ||
          rootUiStore.currentAppState === 'out-of-order' ||
          rootUiStore.currentAppState === 'wash-in-progress'
        ) {
          if (washState === WashResult.IDLE) {
            rootUiStore.reset();
          } else if (
            washState === WashResult.BUSY &&
            rootUiStore.currentAppState !== 'wash-in-progress'
          ) {
            rootUiStore.setAppState('busy');
          }
        }
      } catch (error) {
        console.error('Error polling wash state:', error);
      }
    };

    const interval = setInterval(pollWashState, timeoutMs);

    return () => {
      clearInterval(interval);
    };
  }, [washSelectionStore, rootUiStore, timeoutMs]);
};
