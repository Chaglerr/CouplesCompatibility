import {makeAutoObservable} from 'mobx';
import {
  CurrencyCode,
  PaymentService,
  PaymentStatus,
  PurchaseResult,
  WashRequest,
  WashResult,
} from '../service/payment-service.ts';
import {v4 as uuid} from 'uuid';

export class PaymentStore {
  private paymentService: PaymentService;

  initPaymentStatus: PaymentStatus;

  constructor(paymentService: PaymentService) {
    this.paymentService = paymentService;
    this.initPaymentStatus = PaymentStatus.FAIL;
    makeAutoObservable(this);
  }

  async initiatePayment(
    amount: number,
    currencyCode: CurrencyCode
  ): Promise<PurchaseResult> {
    try {
      return await this.paymentService.initiatePayment({
        amount: amount,
        currencyCode: currencyCode,
        transactionId: uuid(),
      });
    } catch (error) {
      console.error('Payment initiation failed:', error);
      return new PurchaseResult('', PaymentStatus.FAIL);
    }
  }

  async cancelPayment(): Promise<void> {
    try {
      await this.paymentService.cancelPayment();
    } catch (error) {
      console.error('Payment cancellation failed:', error);
    }
  }

  async autoReversal(transactionId: string): Promise<PaymentStatus> {
    try {
      return await this.paymentService.autoReversal(transactionId);
    } catch (error) {
      console.error('Auto-reversal failed:', error);
      return PaymentStatus.FAIL;
    }
  }

  async wash(programId: number): Promise<WashResult> {
    try {
      return await this.paymentService.wash(new WashRequest(programId));
    } catch (error) {
      console.error('Wash initiation failed:', error);
      return WashResult.OUT_OF_ORDER;
    }
  }
}
