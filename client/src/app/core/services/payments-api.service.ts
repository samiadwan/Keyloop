import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface CreateCheckoutSessionRequest {
  bookingId: string;
  vehicleId: string;
  insuranceTier: string;
  pickupDate: string;
  returnDate: string;
}

export interface CreateCheckoutSessionResponse {
  checkoutUrl: string;
}

export interface SessionVerifyResponse {
  paid: boolean;
  bookingId: string | null;
  paymentStatus: string | null;
  amountTotalCents: number | null;
  currency: string | null;
}

@Injectable({ providedIn: 'root' })
export class PaymentsApiService {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.apiBaseUrl}/api/payments`;

  createCheckoutSession(body: CreateCheckoutSessionRequest): Observable<CreateCheckoutSessionResponse> {
    return this.http.post<CreateCheckoutSessionResponse>(`${this.base}/checkout-session`, body);
  }

  verifySession(sessionId: string): Observable<SessionVerifyResponse> {
    return this.http.get<SessionVerifyResponse>(
      `${this.base}/session/${encodeURIComponent(sessionId)}`,
    );
  }
}
