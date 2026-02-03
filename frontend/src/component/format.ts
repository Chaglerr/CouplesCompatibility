import translate from '../locale/message.ts';

export function formatAmount(price: number) {
  const majorPart = Math.floor(price / 100).toString();
  const minorPart = (price % 100).toString().padStart(2, '0');
  const currencyLabel = translate('gel');

  if (minorPart === '00') {
    return `${majorPart}${currencyLabel}`;
  }
  return `${majorPart}.${minorPart}${currencyLabel}`;
}

export function formatTime(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  const minutesLabel = translate('minutes');

  if (remainingSeconds === 0) {
    return `${minutes} ${minutesLabel}`;
  }

  return `${minutes} : ${remainingSeconds} ${minutesLabel}`;
}

export function formatLicensePlate(licensePlate: string): string {
  const cleanPlate = licensePlate.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();

  const regex = /^([A-Z]{2})(\d{3})([A-Z]{2})$/;
  const match = cleanPlate.match(regex);

  if (match) {
    return `${match[1]}-${match[2]}-${match[3]}`;
  } else {
    return licensePlate;
  }
}
