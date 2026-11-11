import { Injectable } from '@angular/core';
import { AppConfig, InsuranceTier } from '../models/app-config.model';
import { ChargeBreakdown, InsuranceTierCode } from '../models/booking.model';

@Injectable({ providedIn: 'root' })
export class PricingService {
  rentalDays(pickup: string, returnDate: string): number {
    const start = this.parseDate(pickup);
    const end = this.parseDate(returnDate);
    const days = Math.floor((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    return Math.max(1, days);
  }

  computeBreakdown(
    dailyPriceUsd: number,
    pickup: string,
    returnDate: string,
    tier: InsuranceTierCode,
    config: AppConfig,
  ): ChargeBreakdown {
    const rentalDays = this.rentalDays(pickup, returnDate);
    const insuranceUsd = this.insuranceAmount(tier, config.insuranceTiers);
    const baseUsd = dailyPriceUsd * rentalDays;
    const platformFeeUsd = config.platformFeeUsd;
    return {
      dailyPriceUsd,
      rentalDays,
      baseUsd,
      insuranceUsd,
      platformFeeUsd,
      totalUsd: baseUsd + insuranceUsd + platformFeeUsd,
    };
  }

  insuranceAmount(tier: InsuranceTierCode, tiers: InsuranceTier[]): number {
    return tiers.find((item) => item.code === tier)?.amountUsd ?? 0;
  }

  private parseDate(isoDate: string): Date {
    const [year, month, day] = isoDate.split('-').map(Number);
    return new Date(year, month - 1, day);
  }
}
