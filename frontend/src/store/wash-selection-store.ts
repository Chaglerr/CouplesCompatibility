import {CSSProperties} from 'react';
import {makeAutoObservable} from 'mobx';
import {WashSelectionService} from '../service/wash-selection-service.ts';

export interface LocalizedText {
  en: string;
  ka: string;
}

export class WashDescriptionDetails {
  washDescription: LocalizedText;
  isActive: boolean;
  times: number;
  specialStyle?: CSSProperties;

  constructor(
    washDescription: LocalizedText,
    isActive: boolean,
    times: number,
    specialStyle?: CSSProperties
  ) {
    this.washDescription = washDescription;
    this.isActive = isActive;
    this.times = times;
    this.specialStyle = specialStyle;
    makeAutoObservable(this);
  }
}

export class WashDetails {
  programId: number;
  washType: LocalizedText;
  washPrice: number;
  washDuration: number;
  washDescriptionDetails: WashDescriptionDetails[];
  isRecommended?: boolean;
  discountedPrice?: number;

  constructor(
    programId: number,
    washType: LocalizedText,
    washPrice: number,
    washDuration: number,
    washDescriptionDetails: WashDescriptionDetails[],
    isRecommended?: boolean,
    discountedPrice?: number
  ) {
    this.programId = programId;
    this.washType = washType;
    this.washPrice = washPrice;
    this.washDuration = washDuration;
    this.washDescriptionDetails = washDescriptionDetails;
    this.isRecommended = isRecommended;
    this.discountedPrice = discountedPrice;
    makeAutoObservable(this);
  }
}

export interface WashSelectionsResponse {
  washSelections: WashDetails[];
  hasDiscount: boolean;
  discountPercentage?: string;
}

export class WashSelectionStore {
  washDetails: WashDetails[] = [];
  hasDiscount: boolean = false;
  discountAmount?: string;
  private washSelectionService: WashSelectionService;

  constructor(washSelectionService: WashSelectionService) {
    this.washSelectionService = washSelectionService;
    makeAutoObservable(this);
  }

  setWashDetails(washDetails: WashDetails[]) {
    this.washDetails = washDetails;
  }

  setDiscountInfo(hasDiscount: boolean, discountPercentage?: string) {
    this.hasDiscount = hasDiscount;
    this.discountAmount = discountPercentage;
  }

  getWashDetails(plate: string) {
    this.washSelectionService.getWashDetails(plate).then(response => {
      console.log('Wash details fetched:', response);
      this.setWashDetails(response.washSelections);
      this.setDiscountInfo(response.hasDiscount, response.discountPercentage);
    });
  }

  getWashState() {
    return this.washSelectionService.getWashState();
  }

  retryPlateDetection() {
    this.washSelectionService.retryPlateDetection().then(() => {
      console.log('Plate detection retry initiated');
    });
  }

  getPhonePromoDiscount() {
    return this.washSelectionService.getPhonePromoDiscount();
  }
}
