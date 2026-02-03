import {CSSProperties} from 'react';

export interface AmountContainerProps {
  amountData: string;
  textColor: string;
  backgroundColor: string;
  isCancelled: boolean;
  onClick?: () => void;
  width?: string;
  height?: string;
  fontSize?: string;
  style?: CSSProperties;
}

export const AmountContainer = ({
  amountData,
  textColor,
  backgroundColor,
  isCancelled,
  onClick,
  width,
  height,
  fontSize,
  style,
}: AmountContainerProps) => {
  return (
    <div
      style={{
        width: width ?? '373px',
        height: height ?? '200px',
        backgroundColor: backgroundColor,
        borderRadius: '30px',
        textAlign: 'center',
        position: 'relative',
        ...style,
      }}
      className="flex align-items-center justify-content-center"
      onClick={onClick}
    >
      <span
        style={{
          color: textColor,
          fontSize: fontSize ?? '92px',
          fontWeight: 'bold',
          textAlign: 'center',
        }}
      >
        {amountData}
      </span>
      {isCancelled && (
        <div
          style={{
            position: 'absolute',
            top: '47%',
            left: '20%',
            right: '20%',
            height: '5px',
            backgroundColor: textColor,
            transformOrigin: 'center',
            transform: 'rotate(-20deg)',
            pointerEvents: 'none',
          }}
        />
      )}
    </div>
  );
};
