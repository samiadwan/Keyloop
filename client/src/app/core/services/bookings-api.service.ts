import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Booking, InsuranceTierCode } from '../models/booking.model';

export interface CreateBookingRequest {
  vehicleId: string;
  vehicleName: string;
  vehicleImageUrl?: string;
  pickupLocation: string;
  pickupDate: string;
  returnDate: string;
}

@Injectable({ providedIn: 'root' })
export class BookingsApiService {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.apiBaseUrl}/api/bookings`;

  list(): Observable<Booking[]> {
    return this.http.get<Booking[]>(this.base);
  }

  getById(id: string): Observable<Booking> {
    return this.http.get<Booking>(`${this.base}/${encodeURIComponent(id)}`);
  }

  create(body: CreateBookingRequest): Observable<Booking> {
    return this.http.post<Booking>(this.base, body);
  }

  updateTier(id: string, insuranceTier: InsuranceTierCode): Observable<Booking> {
    return this.http.patch<Booking>(`${this.base}/${encodeURIComponent(id)}`, { insuranceTier });
  }

  cancel(id: string): Observable<Booking> {
    return this.http.post<Booking>(`${this.base}/${encodeURIComponent(id)}/cancel`, {});
  }
}
