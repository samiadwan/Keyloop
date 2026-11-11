export type BookingStatus = 'Pending' | 'Paid' | 'Cancelled';

export type InsuranceTierCode = 'Basic' | 'Standard' | 'Premium';

export interface ChargeBreakdown {
  dailyPriceUsd: number;
  rentalDays: number;
  baseUsd: number;
  insuranceUsd: number;
  platformFeeUsd: number;
  totalUsd: number;
}

export interface Booking {
  id: string;
  vehicleId: string;
  vehicleName?: string;
  vehicleImageUrl?: string;
  pickupLocation: string;
  pickupDate: string;
  returnDate: string;
  status: BookingStatus;
  createdAt: string;
  insuranceTier?: InsuranceTierCode;
  chargeBreakdown?: ChargeBreakdown;
}

export type NewBooking = Omit<Booking, 'id' | 'status' | 'createdAt'>;
