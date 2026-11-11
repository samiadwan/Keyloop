export interface Vehicle {
  id: string;
  name: string;
  imageUrl: string;
  location: string;
  dailyPriceUsd: number;
  features: string[];
  rules: string[];
}
