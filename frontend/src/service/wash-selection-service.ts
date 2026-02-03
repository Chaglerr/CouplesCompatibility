import {WashSelectionsResponse} from '../store/wash-selection-store.ts';
import {get, post} from './axios-config.ts';
import {WashResult} from './payment-service.ts';

export class WashSelectionService {
  async getWashDetails(plate: string): Promise<WashSelectionsResponse> {
    const {data} = await get(`/api/wash-selections?plate=${encodeURIComponent(plate)}`);

    return data;
  }

  async getWashState(): Promise<WashResult> {
    const {data} = await get('/api/wash/state');
    return data;
  }

  async retryPlateDetection(): Promise<void> {
    await post('/api/plate/retry');
  }

  async getPhonePromoDiscount(): Promise<{
    phonePromoDiscount: number | null;
    hasDiscount: boolean;
  }> {
    const {data} = await get('/api/promo/phone-discount');
    return data;
  }
}
