import './paymentselection.css';
import translate from '../../locale/message.ts';
import {useContext} from 'react';
import {RootUiStoreContext} from '../../store/RootUiStore.tsx';

interface BackButtonProps {
  onClick: () => void;
}

export const BackButton = ({onClick}: BackButtonProps) => {
  const rootUiStore = useContext(RootUiStoreContext);
  const englishTextClassname = rootUiStore.locale === 'ka' ? '' : 'visby-font';

  return (
    <div className="custom-back-button-wrapper" onClick={onClick}>
      <div className="custom-back-button-container">
        <img
          src="./resources/back_button_shape.svg"
          alt="back"
          className="custom-back-button"
        />
        <div className="custom-back-button-content">
          <img
            src="./resources/back.svg"
            alt="back"
            className="custom-back-icon-image"
          />
          <span className={`custom-back-button-text ${englishTextClassname}`}>
            {translate('back')}
          </span>
        </div>
      </div>
    </div>
  );
};
