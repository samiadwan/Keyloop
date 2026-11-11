export interface InsuranceTier {
  code: string;
  label: string;
  amountUsd: number;
}

export interface AppConfig {
  currency: string;
  platformFeeUsd: number;
  insuranceTiers: InsuranceTier[];
  rentalDayRule: string;
}
