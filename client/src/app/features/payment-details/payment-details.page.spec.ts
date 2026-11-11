import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { afterEach, describe, expect, it } from 'vitest';
import { AppConfig } from '../../core/models/app-config.model';
import { Booking } from '../../core/models/booking.model';
import { Vehicle } from '../../core/models/vehicle.model';
import { PaymentDetailsPage } from './payment-details.page';

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

const vehicle: Vehicle = {
  id: 'v-test',
  name: 'Test Sedan',
  imageUrl: '/assets/vehicles/v-test.jpg',
  location: 'Sydney',
  dailyPriceUsd: 100,
  features: [],
  rules: [],
};

function pendingBooking(): Booking {
  return {
    id: 'TRP-001',
    vehicleId: 'v-test',
    vehicleName: 'Test Sedan',
    pickupLocation: 'Sydney',
    pickupDate: '2030-01-01',
    returnDate: '2030-01-04',
    status: 'Pending',
    createdAt: '2030-01-01T00:00:00Z',
  };
}

describe('PaymentDetailsPage', () => {
  afterEach(() => {
    TestBed.inject(HttpTestingController).verify();
  });

  async function open(url: string, booking: Booking | null): Promise<PaymentDetailsPage> {
    await TestBed.configureTestingModule({
      imports: [PaymentDetailsPage],
      providers: [
        provideRouter([{ path: 'bookings/:bookingId/payment', component: PaymentDetailsPage }]),
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    }).compileComponents();
    const harness = await RouterTestingHarness.create();
    const pending = harness.navigateByUrl(url, PaymentDetailsPage);
    await new Promise((resolve) => setTimeout(resolve, 0));
    const http = TestBed.inject(HttpTestingController);
    const id = url.split('/')[2];
    const get = http.expectOne(`http://localhost:5077/api/bookings/${id}`);
    if (!booking) {
      get.flush('missing', { status: 404, statusText: 'Not Found' });
    } else {
      get.flush(booking);
      await new Promise((resolve) => setTimeout(resolve, 0));
      http.expectOne('http://localhost:5077/api/config').flush(config);
      http.expectOne(`http://localhost:5077/api/vehicles/${booking.vehicleId}`).flush(vehicle);
    }
    return pending;
  }

  it('does not invent a booking that is missing', async () => {
    const page = await open('/bookings/TRP-009/payment', null);
    expect(page.booking()).toBeNull();
    TestBed.inject(HttpTestingController).expectNone('http://localhost:5077/api/bookings');
  });

  it('UAT-7: pay stays blocked until one tier is selected', async () => {
    const page = await open('/bookings/TRP-001/payment', pendingBooking());
    const http = TestBed.inject(HttpTestingController);

    expect(page.canContinue()).toBe(false);
    page.onPay();
    expect(page.payMessage()).toBeNull();
    http.expectNone('http://localhost:5077/api/payments/checkout-session');
  });

  it('UAT-6: changing tier updates the total and saves only that booking', async () => {
    const page = await open('/bookings/TRP-001/payment', pendingBooking());
    const http = TestBed.inject(HttpTestingController);

    page.onTierChange('Basic');
    expect(page.breakdown()?.totalUsd).toBe(805);
    const basic = http.expectOne('http://localhost:5077/api/bookings/TRP-001');
    expect(basic.request.method).toBe('PATCH');
    expect(basic.request.body).toEqual({ insuranceTier: 'Basic' });
    basic.flush({ ...pendingBooking(), insuranceTier: 'Basic' });

    page.onTierChange('Standard');
    expect(page.breakdown()?.totalUsd).toBe(1305);
    expect(page.canContinue()).toBe(true);
    const standard = http.expectOne('http://localhost:5077/api/bookings/TRP-001');
    expect(standard.request.body).toEqual({ insuranceTier: 'Standard' });
    standard.flush({ ...pendingBooking(), insuranceTier: 'Standard' });
    http.expectNone('http://localhost:5077/api/bookings/TRP-002');
  });

  it('shows the Stripe test-mode notice and does not collect a card', async () => {
    await TestBed.configureTestingModule({
      imports: [PaymentDetailsPage],
      providers: [
        provideRouter([{ path: 'bookings/:bookingId/payment', component: PaymentDetailsPage }]),
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    }).compileComponents();
    const harness = await RouterTestingHarness.create();
    const pending = harness.navigateByUrl('/bookings/TRP-001/payment', PaymentDetailsPage);
    await new Promise((resolve) => setTimeout(resolve, 0));
    const http = TestBed.inject(HttpTestingController);
    http.expectOne('http://localhost:5077/api/bookings/TRP-001').flush(pendingBooking());
    await new Promise((resolve) => setTimeout(resolve, 0));
    http.expectOne('http://localhost:5077/api/config').flush(config);
    http.expectOne('http://localhost:5077/api/vehicles/v-test').flush(vehicle);
    const page = await pending;
    const root = harness.fixture.nativeElement as HTMLElement;

    expect(page.testModeNotice).toContain('Stripe Checkout (test mode)');
    expect(root.textContent).toContain('Stripe Checkout (test mode)');
    expect(root.querySelector('input[autocomplete="cc-number"]')).toBeNull();
    expect(root.querySelectorAll('input[type="radio"]').length).toBeGreaterThan(0);
  });
});
