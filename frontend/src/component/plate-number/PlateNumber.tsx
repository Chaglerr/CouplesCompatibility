import {useContext} from 'react';
import {RootUiStoreContext} from '../../store/RootUiStore.tsx';

export const PlateNumber = () => {
  const rootUiStore = useContext(RootUiStoreContext);
  const plateNumber = rootUiStore.licensePlate;

  return (
    <div
      style={{
        width: '700px',
        height: '140px',
        backgroundColor: 'var(--plate-number-bg)',
        borderRadius: '25px',
        border: '9px solid var(--plate-number-border)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
      }}
    >
      <span
        style={{
          fontSize: '112px',
          fontWeight: 'bold',
          color: 'var(--plate-number-text)',
          textAlign: 'center',
        }}
      >
        {plateNumber}
      </span>
    </div>
  );
};
