import {post} from './axios-config.ts';

export class InitPaymentRequest {
  amount: number = 0;
  currencyCode: CurrencyCode = CurrencyCode.GEL;
  transactionId?: string;
}

export class WashRequest {
  programId: number = 0;

  constructor(programId: number) {
    this.programId = programId;
  }
}

export enum CurrencyCode {
  GEL = '981',
  PLUS = '205',
  MR = '207',
  SCOOL = '201',
}

export enum PaymentStatus {
  SUCCESS = 'SUCCESS',
  FAIL = 'FAIL',
  DEFAULT = 'DEFAULT',
  ACCEPTED = 'ACCEPTED',
}

export enum WashResult {
  SUCCESS = 'SUCCESS',
  BUSY = 'BUSY',
  OUT_OF_ORDER = 'OUT_OF_ORDER',
  IDLE = 'IDLE',
}

export class PurchaseResult {
  transactionId: string = '';
  result: PaymentStatus = PaymentStatus.DEFAULT;

  constructor(transactionId: string, status: PaymentStatus) {
    this.transactionId = transactionId;
    this.result = status;
  }
}

export class PaymentService {
  async initiatePayment(
    initPaymentRequest: InitPaymentRequest
  ): Promise<PurchaseResult> {
    const {data} = await post('/api/payment/initiate', initPaymentRequest);

    return data;
  }

  async cancelPayment(): Promise<void> {
    return await post('/api/payment/cancel');
  }

  async autoReversal(transactionId: string): Promise<PaymentStatus> {
    const {data} = await post(`/api/payment/auto-reversal/${transactionId}`);

    return data;
  }

  async wash(washRequest: WashRequest): Promise<WashResult> {
    const {data} = await post('/api/wash/gamrecxe', washRequest);
    return data;
  }
}
