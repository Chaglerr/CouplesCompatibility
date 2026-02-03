import './washselection.css';
import {useContext} from 'react';
import {observer} from 'mobx-react-lite';
import {RootUiStoreContext} from '../../store/RootUiStore.tsx';
import {formatAmount, formatTime} from '../format.ts';
import translate from '../../locale/message.ts';
import {WashDetails} from '../../store/wash-selection-store.ts';
import {AmountContainer} from '../shared/AmountContainer.tsx';

export interface WashDetailsProps {
  washDetails: WashDetails;
  timeIconPath: string;
  onClick: () => void;
  hasDiscount: boolean;
}

export const WashDetailsComponent = observer(
  ({washDetails, onClick, timeIconPath, hasDiscount}: WashDetailsProps) => {
    const rootUiStore = useContext(RootUiStoreContext);

    if (!washDetails) {
      return;
    }

    const washType =
      rootUiStore.locale === 'ka' ? washDetails.washType.ka : washDetails.washType.en;
    const washPrice = washDetails.washPrice;
    const washDuration = washDetails.washDuration;
    const washDescriptionDetails = washDetails.washDescriptionDetails;
    const isRecommended = washDetails.isRecommended;

    const buttonStyle = {
      borderRadius: '12px',
      border: 'none',
      marginTop: '30px',
      fontSize: '30px',
      fontWeight: 'bold',
      textAlign: 'center' as const,
    };

    return (
      <div
        style={{position: 'relative'}}
        className="wash-details-container"
        onClick={onClick}
      >
        {/*header*/}
        <div
          className={
            isRecommended ? 'wash-details-header-recommended' : 'wash-details-header'
          }
        >
          <div className={isRecommended ? 'wash-type-label' : ''}>{washType}</div>
          {isRecommended && (
            <div className="recommended-label">{translate('recommended')}</div>
          )}
        </div>
        <div
          className={
            isRecommended
              ? 'wash-details-content-wrapper-recommended'
              : 'wash-details-content-wrapper'
          }
        >
          {/* Duration box */}
          <div className="wash-details-duration">
            <img
              src={timeIconPath}
              alt="clock"
              style={{width: '34px', height: '38px'}}
            />
            <span style={{marginTop: '5px'}}>{formatTime(washDuration)}</span>
          </div>
          {/* Description list */}
          <div className="wash-details-list-container">
            {washDescriptionDetails.map((desc, index) => (
              <div
                key={index}
                style={{
                  color: desc.isActive
                    ? 'var(--text-color)'
                    : 'var(--inactive-text-color)',
                  ...desc.specialStyle,
                }}
                className="wash-details-entry graphik-font"
              >
                <span style={{position: 'relative', maxWidth: '209px'}}>
                  {rootUiStore.locale === 'ka'
                    ? desc.washDescription.ka
                    : desc.washDescription.en}
                  {desc.times > 1 && desc.isActive && (
                    <span className="wash-details-double">x{desc.times}</span>
                  )}
                </span>
                <span
                  style={{
                    backgroundColor: desc.isActive
                      ? 'var(--primary)'
                      : 'var(--inactive-text-color)',
                  }}
                  className="wash-details-is-active-button"
                />
              </div>
            ))}
          </div>
          {/* Price Button */}
          {hasDiscount ? (
            <div className="amount-button-container justify-content-between">
              <AmountContainer
                amountData={formatAmount(washDetails.discountedPrice ?? 0)}
                textColor={'white'}
                backgroundColor={'var(--discount-yellow)'}
                isCancelled={false}
                width={'131px'}
                height={'70px'}
                onClick={onClick}
                fontSize={'30px'}
                style={buttonStyle}
              />
              <AmountContainer
                amountData={formatAmount(washPrice)}
                textColor={'var(--cancelled-text)'}
                backgroundColor={'var(--cancelled-bg)'}
                isCancelled={true}
                width={'131px'}
                height={'70px'}
                onClick={onClick}
                fontSize={'30px'}
                style={buttonStyle}
              />
            </div>
          ) : (
            <div className="amount-button-container">
              <button onClick={onClick} style={{}} className="amount-button">
                {formatAmount(washPrice)}
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }
);
