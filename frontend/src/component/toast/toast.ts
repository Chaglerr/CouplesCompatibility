import {Toast, ToastMessage} from 'primereact/toast';
import translate from '../../locale/message.ts';
import React from 'react';

export const TOAST_REF = React.createRef<Toast>();
export function showToast(message: ToastMessage) {
  TOAST_REF.current?.show(message);
}

export class ToastFactory {
  static success(message: string): ToastMessage {
    return {
      severity: 'success',
      summary: translate('success'),
      detail: message,
      life: 5000,
    };
  }

  static info(message: string): ToastMessage {
    return {
      severity: 'info',
      summary: translate('info'),
      detail: message,
      life: 5000,
    };
  }

  static error(message: string): ToastMessage {
    return {
      severity: 'error',
      summary: translate('failure'),
      detail: message,
      life: 10000,
    };
  }
}
