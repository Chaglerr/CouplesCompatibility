import {useWashState} from '../wash-in-progress/UseWashState.tsx';

export interface OutOfOrderProps {
  textEn?: string;
  textKa?: string;
  type?: 'out-of-order' | 'busy' | 'plate-not-detected';
}

export const OutOfOrder = ({textEn, textKa}: OutOfOrderProps) => {
  useWashState();

  return (
    <div
      className="w-full h-full flex flex-column align-items-center justify-content-center"
      style={{backgroundColor: 'var(--out-of-order-bg)'}}
    >
      <img
        src="./resources/out_of_order.svg"
        alt="Out of Order"
        style={{width: '450px', height: '450px'}}
      />
      <span
        style={{
          color: 'var(--secondary-text-color)',
          fontSize: '100px',
          lineHeight: '133px',
          textAlign: 'center',
        }}
      >
        {textKa ? textKa : 'არ მუშაობს'}
      </span>
      <span
        style={{
          color: 'var(--secondary-text-color)',
          fontSize: '100px',
          lineHeight: '133px',
          textAlign: 'center',
        }}
        className="visby-font"
      >
        {textEn ? textEn : 'Out of Order'}
      </span>
    </div>
  );
};
