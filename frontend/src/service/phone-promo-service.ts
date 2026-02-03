import {post} from './axios-config.ts';

export interface PhonePromoRequest {
  plate: string;
  phone_number: string;
  agreed_to_ads: boolean;
}

export interface PhonePromoResponse {
  has_discount: boolean;
  discount_amount: number;
  prices: {
    programId: number;
    washPrice: number;
  }[];
}

export class PhonePromoService {
  private readonly DRIWO_PHONE_PROMO_API_URL =
    'https://driwo.ge/api/getPhonePromoPrice';
  private readonly BEARER_TOKEN = import.meta.env.VITE_DRIWO_PHONE_PROMO_BEARER_TOKEN;

  async getPhonePromoPrice(request: PhonePromoRequest): Promise<PhonePromoResponse> {
    const headers = {
      Authorization: `Bearer ${this.BEARER_TOKEN}`,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    };

    const response = await post(
      this.DRIWO_PHONE_PROMO_API_URL,
      {
        ...request,
      },
      {
        headers: headers,
      }
    );

    return response.data;
  }
}
