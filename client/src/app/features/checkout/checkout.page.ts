import { CurrencyPipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { KeyloopLogoComponent } from '../../core/components/keyloop-logo/keyloop-logo.component';
import { STRIPE_TEST_MODE_NOTICE } from '../../core/constants/stripe-notice';
import { Booking } from '../../core/models/booking.model';
import { BookingsApiService } from '../../core/services/bookings-api.service';
import { PaymentsApiService } from '../../core/services/payments-api.service';

@Component({
  selector: 'app-checkout',
  imports: [CurrencyPipe, KeyloopLogoComponent, RouterLink],
  template: `
    <header class="kl-page-header">
      <nav class="kl-nav" aria-label="Primary">
        <app-keyloop-logo />
        <a routerLink="/trips" class="kl-btn-secondary">Trips</a>
      </nav>
    </header>
    <main id="main-content" tabindex="-1">
      <p class="kl-alert-info" role="note">{{ testModeNotice }}</p>
      @if (booking(); as current) {
        <section class="kl-card">
          <h1>Checkout</h1>
          <p>Booking {{ current.id }} is {{ current.status }}.</p>
          <p>{{ current.vehicleName }}</p>
          <p>{{ current.pickupLocation }}</p>
          <p>{{ current.pickupDate }} to {{ current.returnDate }}</p>
          @if (current.insuranceTier) {
            <p>Insurance: {{ current.insuranceTier }}</p>
          }
          @if (current.chargeBreakdown; as charges) {
            <p>Total: {{ charges.totalUsd | currency: 'USD' }}</p>
          }
        </section>

        @if (current.status === 'Cancelled') {
          <p class="kl-alert-info" role="status">This booking was cancelled and cannot be paid.</p>
        } @else if (success() || current.status === 'Paid') {
          <p class="kl-alert-info" role="status">Payment successful. Your booking is now Paid.</p>
          <a routerLink="/trips">Trips</a>
        } @else {
          <section class="kl-card">
            <h2>Pay with Stripe</h2>
            <p>You will be redirected to Stripe Checkout. Card details are entered on Stripe, not in this app.</p>
            @if (submitError()) {
              <p class="kl-alert-error" role="alert">{{ submitError() }}</p>
            }
            <button type="button" class="kl-btn-primary" [disabled]="!canPay() || processing()" (click)="startStripeCheckout()">
              @if (processing()) {
                Preparing checkout…
              } @else {
                Pay with card (Stripe test)
              }
            </button>
            <a [routerLink]="['/bookings', current.id, 'payment']">Back to payment details</a>
          </section>
        }
      } @else {
        <section class="kl-card">
          <h1>Checkout</h1>
          <p class="kl-alert-error" role="alert">This booking was not found.</p>
          <a routerLink="/trips">Trips</a>
          <a routerLink="/">Landing</a>
        </section>
      }
    </main>
  `,
})
export class CheckoutPage implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly bookings = inject(BookingsApiService);
  private readonly payments = inject(PaymentsApiService);

  readonly testModeNotice = STRIPE_TEST_MODE_NOTICE;
  readonly booking = signal<Booking | null>(null);
  readonly submitError = signal<string | null>(null);
  readonly success = signal(false);
  readonly processing = signal(false);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('bookingId');
    if (!id) {
      this.booking.set(null);
      return;
    }

    this.bookings.getById(id).subscribe({
      next: (current) => this.applyBooking(current),
      error: () => this.booking.set(null),
    });
  }

  private applyBooking(current: Booking): void {
    if (current.status === 'Pending' && !current.insuranceTier) {
      void this.router.navigate(['/bookings', current.id, 'payment']);
      return;
    }

    this.booking.set(current);
    if (current.status === 'Paid') {
      this.success.set(true);
      return;
    }

    const stripe = this.route.snapshot.queryParamMap.get('stripe');
    const sessionId = this.route.snapshot.queryParamMap.get('session_id');
    if (stripe === 'success' && sessionId) {
      this.verifyReturn(current.id, sessionId);
    } else if (stripe === 'cancelled') {
      this.submitError.set('Payment was cancelled. You can try again.');
    }
  }

  canPay(): boolean {
    const current = this.booking();
    return !!current && current.status === 'Pending' && !!current.insuranceTier && !this.success() && !this.processing();
  }

  startStripeCheckout(): void {
    const current = this.booking();
    if (!current?.insuranceTier || current.status !== 'Pending' || this.processing()) {
      return;
    }
    this.processing.set(true);
    this.submitError.set(null);
    this.payments
      .createCheckoutSession({
        bookingId: current.id,
        vehicleId: current.vehicleId,
        insuranceTier: current.insuranceTier,
        pickupDate: current.pickupDate,
        returnDate: current.returnDate,
      })
      .subscribe({
        next: (response) => {
          if (!response.checkoutUrl) {
            this.submitError.set('No checkout URL returned from the server.');
            this.processing.set(false);
            return;
          }
          this.redirectTo(response.checkoutUrl);
        },
        error: (err: HttpErrorResponse) => {
          this.processing.set(false);
          this.submitError.set(this.readError(err, 'Could not start Stripe checkout. Is Stripe configured?'));
        },
      });
  }

  redirectTo(url: string): void {
    window.location.assign(url);
  }

  private verifyReturn(bookingId: string, sessionId: string): void {
    this.processing.set(true);
    this.submitError.set(null);
    this.payments.verifySession(sessionId).subscribe({
      next: (response) => {
        this.processing.set(false);
        if (!response.paid || response.bookingId !== bookingId) {
          this.submitError.set(
            response.paid
              ? 'Payment was confirmed for a different booking and was not applied.'
              : 'Payment was not completed. You can try again.',
          );
          return;
        }
        this.bookings.getById(bookingId).subscribe({
          next: (updated) => {
            this.booking.set(updated);
            if (updated.status === 'Paid') {
              this.success.set(true);
              return;
            }
            this.submitError.set('Could not update booking after payment.');
          },
          error: () => this.submitError.set('Could not update booking after payment.'),
        });
      },
      error: (err: HttpErrorResponse) => {
        this.processing.set(false);
        this.submitError.set(this.readError(err, 'Could not verify payment with the server.'));
      },
    });
  }

  private readError(err: HttpErrorResponse, fallback: string): string {
    return typeof err.error === 'string' && err.error.trim() ? err.error : fallback;
  }
}
