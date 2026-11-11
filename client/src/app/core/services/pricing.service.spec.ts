import { describe, expect, it } from 'vitest';
import { AppConfig } from '../models/app-config.model';
import { PricingService } from './pricing.service';

const config: AppConfig = {
  currency: 'USD',
  platformFeeUsd: 5,
  rentalDayRule: 'calendarDaysMin1',
  insuranceTiers: [
    { code: 'Basic', label: 'Basic', amountUsd: 500 },
    { code: 'Standard', label: 'Standard', amountUsd: 1000 },
    { code: 'Premium', label: 'Premium', amountUsd: 1500 },
  ],
};

describe('PricingService', () => {
  const service = new PricingService();

  it('uses a minimum of 1 rental day', () => {
    expect(service.rentalDays('2030-01-01', '2030-01-01')).toBe(1);
  });

  it('prices a $100 vehicle for 3 days at Standard as 1305', () => {
    const breakdown = service.computeBreakdown(100, '2030-01-01', '2030-01-04', 'Standard', config);
    expect(breakdown.rentalDays).toBe(3);
    expect(breakdown.baseUsd).toBe(300);
    expect(breakdown.insuranceUsd).toBe(1000);
    expect(breakdown.platformFeeUsd).toBe(5);
    expect(breakdown.totalUsd).toBe(1305);
  });

  it('UAT-6: changing tier changes the total immediately', () => {
    const basic = service.computeBreakdown(100, '2030-01-01', '2030-01-04', 'Basic', config);
    const premium = service.computeBreakdown(100, '2030-01-01', '2030-01-04', 'Premium', config);
    expect(basic.totalUsd).toBe(805);
    expect(premium.totalUsd).toBe(1805);
    expect(premium.totalUsd).toBeGreaterThan(basic.totalUsd);
  });
});
