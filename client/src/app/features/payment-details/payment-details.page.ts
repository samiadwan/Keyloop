import { CurrencyPipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { KeyloopLogoComponent } from '../../core/components/keyloop-logo/keyloop-logo.component';
import { STRIPE_TEST_MODE_NOTICE } from '../../core/constants/stripe-notice';
import { AppConfig } from '../../core/models/app-config.model';
import { Booking, ChargeBreakdown, InsuranceTierCode } from '../../core/models/booking.model';
import { Vehicle } from '../../core/models/vehicle.model';
import { AppConfigService } from '../../core/services/app-config.service';
import { BookingsApiService } from '../../core/services/bookings-api.service';
import { PaymentsApiService } from '../../core/services/payments-api.service';
import { PricingService } from '../../core/services/pricing.service';
import { VehicleCatalogService } from '../../core/services/vehicle-catalog.service';

const TIER_CODES: InsuranceTierCode[] = ['Basic', 'Standard', 'Premium'];

@Component({
  selector: 'app-payment-details',
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
          <h1>Payment details</h1>
          <p>Booking {{ current.id }} is {{ current.status }}.</p>
          <p>{{ vehicle()?.name || current.vehicleName }}</p>
          <p>{{ current.pickupLocation }}</p>
          <p>{{ current.pickupDate }} to {{ current.returnDate }}</p>
          @if (vehicle(); as currentVehicle) {
            <p>{{ currentVehicle.dailyPriceUsd | currency: 'USD' }} / day</p>
          }
        </section>

        @if (loadError()) {
          <p class="kl-alert-error" role="alert">{{ loadError() }}</p>
        }

        @if (current.status === 'Pending') {
          <section class="kl-card" aria-labelledby="insurance-heading">
            <h2 id="insurance-heading">Insurance</h2>
            <p id="insurance-hint">Select one option to continue.</p>
            <fieldset class="kl-choice-list">
              <legend class="kl-hint">Insurance tier</legend>
              @for (code of tierCodes(); track code) {
                <label class="kl-choice">
                  <input
                    type="radio"
                    name="insuranceTier"
                    [value]="code"
                    [checked]="selectedTier() === code"
                    (change)="onTierChange(code)"
                  />
                  {{ insuranceLabel(code) }}
                </label>
              }
            </fieldset>
          </section>

          @if (breakdown(); as charges) {
            <section class="kl-card" aria-labelledby="charges-heading">
              <h2 id="charges-heading">Charge breakdown</h2>
              <dl class="kl-charges">
                <div>
                  <dt>Daily price</dt>
                  <dd>{{ charges.dailyPriceUsd | currency: 'USD' }}</dd>
                </div>
                <div>
                  <dt>Rental days</dt>
                  <dd>{{ charges.rentalDays }}</dd>
                </div>
                <div>
                  <dt>Base rental</dt>
                  <dd>{{ charges.baseUsd | currency: 'USD' }}</dd>
                </div>
                <div>
                  <dt>Insurance</dt>
                  <dd>{{ charges.insuranceUsd | currency: 'USD' }}</dd>
                </div>
                <div>
                  <dt>Platform fee</dt>
                  <dd>{{ charges.platformFeeUsd | currency: 'USD' }}</dd>
                </div>
                <div class="kl-total">
                  <dt>Total</dt>
                  <dd>{{ charges.totalUsd | currency: 'USD' }}</dd>
                </div>
              </dl>
            </section>
          }

          <button
            type="button"
            class="kl-btn-primary"
            [disabled]="!canContinue() || paying()"
            [attr.aria-describedby]="canContinue() ? null : 'insurance-hint'"
            (click)="onPay()"
          >
            @if (paying()) {
              Opening Stripe…
            } @else {
              Pay with Stripe
            }
          </button>
          @if (payMessage()) {
            <p class="kl-alert-error" role="alert">{{ payMessage() }}</p>
          }
        }
      } @else {
        <section class="kl-card">
          <h1>Payment details</h1>
          <p class="kl-alert-error" role="alert">This booking was not found.</p>
          <a routerLink="/trips">Trips</a>
          <a routerLink="/">Landing</a>
        </section>
      }
    </main>
  `,
})
export class PaymentDetailsPage implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly bookings = inject(BookingsApiService);
  private readonly vehiclesApi = inject(VehicleCatalogService);
  private readonly configApi = inject(AppConfigService);
  private readonly pricing = inject(PricingService);
  private readonly payments = inject(PaymentsApiService);

  readonly testModeNotice = STRIPE_TEST_MODE_NOTICE;
  readonly booking = signal<Booking | null>(null);
  readonly vehicle = signal<Vehicle | null>(null);
  readonly config = signal<AppConfig | null>(null);
  readonly loadError = signal<string | null>(null);
  readonly payMessage = signal<string | null>(null);
  readonly paying = signal(false);
  readonly selectedTier = signal<InsuranceTierCode | ''>('');

  readonly breakdown = computed((): ChargeBreakdown | null => {
    const current = this.booking();
    const currentVehicle = this.vehicle();
    const currentConfig = this.config();
    const tier = this.selectedTier();
    if (!current || !currentVehicle || !currentConfig || !tier) {
      return null;
    }
    return this.pricing.computeBreakdown(
      currentVehicle.dailyPriceUsd,
      current.pickupDate,
      current.returnDate,
      tier,
      currentConfig,
    );
  });

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('bookingId');
    if (!id) {
      this.booking.set(null);
      return;
    }

    this.bookings.getById(id).subscribe({
      next: (current) => this.loadPricing(current),
      error: () => this.booking.set(null),
    });
  }

  private loadPricing(current: Booking): void {
    this.booking.set(current);
    if (current.insuranceTier) {
      this.selectedTier.set(current.insuranceTier);
    }

    this.configApi.getConfig().subscribe({
      next: (config) => {
        this.config.set(config);
        this.persistSelection();
      },
      error: () => this.loadError.set('Could not load pricing configuration.'),
    });

    this.vehiclesApi.getVehicle(current.vehicleId).subscribe({
      next: (vehicle) => {
        this.vehicle.set(vehicle);
        this.persistSelection();
      },
      error: () => this.loadError.set('Could not load vehicle details.'),
    });
  }

  tierCodes(): InsuranceTierCode[] {
    return TIER_CODES;
  }

  insuranceLabel(code: InsuranceTierCode): string {
    const tier = this.config()?.insuranceTiers.find((item) => item.code === code);
    if (!tier) {
      return code;
    }
    return `${tier.label} (${tier.amountUsd} USD)`;
  }

  onTierChange(tier: InsuranceTierCode): void {
    this.selectedTier.set(tier);
    this.payMessage.set(null);
    this.persistSelection();
  }

  canContinue(): boolean {
    const current = this.booking();
    return !!current && current.status === 'Pending' && !!this.selectedTier() && !!this.breakdown() && !this.loadError();
  }

  onPay(): void {
    if (!this.canContinue() || this.paying()) {
      return;
    }
    const current = this.booking();
    const tier = this.selectedTier();
    if (!current || !tier) {
      return;
    }
    this.payMessage.set(null);
    this.paying.set(true);
    this.bookings.updateTier(current.id, tier).subscribe({
      next: (updated) => {
        this.booking.set({ ...updated, insuranceTier: tier });
        this.payments
          .createCheckoutSession({
            bookingId: current.id,
            vehicleId: current.vehicleId,
            insuranceTier: tier,
            pickupDate: current.pickupDate,
            returnDate: current.returnDate,
          })
          .subscribe({
            next: (response) => {
              if (!response.checkoutUrl) {
                this.payMessage.set('No checkout URL returned from the server.');
                this.paying.set(false);
                return;
              }
              this.redirectTo(response.checkoutUrl);
            },
            error: (err: HttpErrorResponse) => {
              this.paying.set(false);
              this.payMessage.set(this.readError(err, 'Could not start Stripe checkout.'));
            },
          });
      },
      error: (err: HttpErrorResponse) => {
        this.paying.set(false);
        this.payMessage.set(this.readError(err, 'Could not save the insurance selection.'));
      },
    });
  }

  redirectTo(url: string): void {
    window.location.assign(url);
  }

  private readError(err: HttpErrorResponse, fallback: string): string {
    return typeof err.error === 'string' && err.error.trim() ? err.error : fallback;
  }

  private persistSelection(): void {
    const current = this.booking();
    const tier = this.selectedTier();
    const charges = this.breakdown();
    if (!current || !tier || !charges) {
      return;
    }
    this.bookings.updateTier(current.id, tier).subscribe({
      next: (updated) => this.booking.set({ ...updated, insuranceTier: tier }),
      error: () => this.payMessage.set('Could not save the insurance selection.'),
    });
  }
}
