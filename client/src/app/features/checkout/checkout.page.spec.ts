import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { STRIPE_TEST_MODE_NOTICE } from '../../core/constants/stripe-notice';
import { Booking } from '../../core/models/booking.model';
import { CheckoutPage } from './checkout.page';

function booking(id: string, status: Booking['status'] = 'Pending'): Booking {
  return {
    id,
    vehicleId: 'v1',
    vehicleName: 'Toyota Corolla',
    pickupLocation: 'Sydney',
    pickupDate: '2030-01-01',
    returnDate: '2030-01-04',
    status,
    createdAt: '2030-01-01T00:00:00Z',
    insuranceTier: id === 'TRP-001' ? 'Basic' : 'Standard',
    chargeBreakdown: {
      dailyPriceUsd: 49,
      rentalDays: 3,
      baseUsd: 147,
      insuranceUsd: 1000,
      platformFeeUsd: 5,
      totalUsd: 1152,
    },
  };
}

describe('CheckoutPage', () => {
  afterEach(() => {
    TestBed.inject(HttpTestingController).verify();
  });

  async function start(url: string): Promise<{ pending: Promise<CheckoutPage>; harness: RouterTestingHarness; http: HttpTestingController }> {
    await TestBed.configureTestingModule({
      imports: [CheckoutPage],
      providers: [
        provideRouter([{ path: 'bookings/:bookingId/checkout', component: CheckoutPage }]),
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    }).compileComponents();
    const harness = await RouterTestingHarness.create();
    const pending = harness.navigateByUrl(url, CheckoutPage);
    await new Promise((resolve) => setTimeout(resolve, 0));
    return { pending, harness, http: TestBed.inject(HttpTestingController) };
  }

  it('shows the test-mode notice and has no card inputs', async () => {
    const { pending, harness, http } = await start('/bookings/TRP-002/checkout');
    http.expectOne('http://localhost:5077/api/bookings/TRP-002').flush(booking('TRP-002'));
    const page = await pending;
    const root = harness.fixture.nativeElement as HTMLElement;

    expect(page.testModeNotice).toBe(STRIPE_TEST_MODE_NOTICE);
    expect(root.textContent).toContain(STRIPE_TEST_MODE_NOTICE);
    expect(root.querySelector('input')).toBeNull();
  });

  it('UAT-8: cancel leaves the booking Pending and shows a message', async () => {
    const { pending, http } = await start('/bookings/TRP-002/checkout?stripe=cancelled');
    http.expectOne('http://localhost:5077/api/bookings/TRP-002').flush(booking('TRP-002'));
    const page = await pending;

    expect(page.submitError()).toBe('Payment was cancelled. You can try again.');
    expect(page.booking()?.status).toBe('Pending');
    http.expectNone('http://localhost:5077/api/bookings/TRP-001');
  });

  it('UAT-9: a verified payment shows that booking as Paid', async () => {
    const { pending, http } = await start('/bookings/TRP-002/checkout?stripe=success&session_id=cs_test_123');
    http.expectOne('http://localhost:5077/api/bookings/TRP-002').flush(booking('TRP-002'));
    await new Promise((resolve) => setTimeout(resolve, 0));
    http.expectOne('http://localhost:5077/api/payments/session/cs_test_123').flush({
      paid: true,
      bookingId: 'TRP-002',
      paymentStatus: 'paid',
      amountTotalCents: 115200,
      currency: 'usd',
    });
    await new Promise((resolve) => setTimeout(resolve, 0));
    http.expectOne('http://localhost:5077/api/bookings/TRP-002').flush(booking('TRP-002', 'Paid'));
    const page = await pending;

    expect(page.success()).toBe(true);
    expect(page.booking()?.status).toBe('Paid');
  });

  it('does not mark Paid when verify says the payment is incomplete', async () => {
    const { pending, http } = await start('/bookings/TRP-002/checkout?stripe=success&session_id=cs_test_open');
    http.expectOne('http://localhost:5077/api/bookings/TRP-002').flush(booking('TRP-002'));
    await new Promise((resolve) => setTimeout(resolve, 0));
    http.expectOne('http://localhost:5077/api/payments/session/cs_test_open').flush({
      paid: false,
      bookingId: 'TRP-002',
      paymentStatus: 'unpaid',
      amountTotalCents: 115200,
      currency: 'usd',
    });
    const page = await pending;

    expect(page.success()).toBe(false);
    expect(page.submitError()).toContain('not completed');
    expect(page.booking()?.status).toBe('Pending');
  });

  it('explains when Stripe is not configured and stores no card fields', async () => {
    const { pending, http } = await start('/bookings/TRP-002/checkout');
    http.expectOne('http://localhost:5077/api/bookings/TRP-002').flush(booking('TRP-002'));
    const page = await pending;
    page.startStripeCheckout();
    http.expectOne('http://localhost:5077/api/payments/checkout-session').flush(
      'Stripe is not configured. Set Stripe:SecretKey (dotnet user-secrets or environment). See docs/guide/stripe-test-setup.md.',
      { status: 503, statusText: 'Service Unavailable' },
    );

    expect(page.submitError()).toContain('Stripe is not configured');
    expect(page.booking()?.status).toBe('Pending');
    expect(sessionStorage.getItem('keyloop.bookings.v1') ?? '').not.toMatch(/pan|cvv|cardNumber|4242/i);
  });

  it('redirects to the checkout URL returned by the API', async () => {
    const { pending, http } = await start('/bookings/TRP-002/checkout');
    http.expectOne('http://localhost:5077/api/bookings/TRP-002').flush(booking('TRP-002'));
    const page = await pending;
    const redirect = vi.spyOn(page, 'redirectTo').mockImplementation(() => undefined);
    page.startStripeCheckout();
    http.expectOne('http://localhost:5077/api/payments/checkout-session').flush({
      checkoutUrl: 'https://checkout.stripe.com/c/pay/cs_test_123',
    });

    expect(redirect).toHaveBeenCalledWith('https://checkout.stripe.com/c/pay/cs_test_123');
  });
});
