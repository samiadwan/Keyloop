import { DatePipe } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { KeyloopLogoComponent } from '../../core/components/keyloop-logo/keyloop-logo.component';
import { MY_TRIPS_EMPTY_MESSAGE } from '../../core/constants/trips-copy';
import { Booking, BookingStatus } from '../../core/models/booking.model';
import { BookingsApiService } from '../../core/services/bookings-api.service';

@Component({
  selector: 'app-my-trips',
  imports: [DatePipe, KeyloopLogoComponent, RouterLink],
  template: `
    <header class="kl-page-header">
      <nav class="kl-nav" aria-label="Primary">
        <app-keyloop-logo />
        <a routerLink="/trips" class="kl-btn-secondary" aria-current="page">Trips</a>
      </nav>
    </header>
    <main id="main-content" tabindex="-1">
      <h1 class="kl-page-title">My booked trips</h1>

      @if (loadError()) {
        <p class="kl-alert-error" role="alert">{{ loadError() }}</p>
      } @else if (!loaded()) {
        <p role="status">Loading trips…</p>
      } @else if (trips().length === 0) {
        <section class="kl-card" aria-labelledby="empty-heading">
          <h2 id="empty-heading" class="kl-sr-only">No trips</h2>
          <p>{{ emptyMessage }}</p>
          <a routerLink="/" class="kl-btn-primary">Browse vehicles</a>
        </section>
      } @else {
        <ul class="kl-trip-list" aria-label="Booked trips">
          @for (b of trips(); track b.id) {
            <li>
              <article class="kl-card kl-trip" [attr.aria-labelledby]="'trip-' + b.id">
                @if (imageFor(b); as src) {
                  <img class="kl-trip-image" [src]="src" [alt]="nameFor(b)" />
                }
                <div class="kl-trip-body">
                  <div [id]="'trip-' + b.id">
                    <h2>{{ nameFor(b) }}</h2>
                    <p>{{ b.pickupLocation }}</p>
                    <p>{{ b.pickupDate }} to {{ b.returnDate }}</p>
                  </div>
                  <p [class]="statusClass(b.status)" role="status">{{ b.status }}</p>
                  <p><strong>Booking ID</strong> {{ b.id }}</p>
                  <p><strong>Booked</strong> {{ b.createdAt | date: 'medium' }}</p>
                  <div class="kl-trip-actions">
                    @if (b.status === 'Pending') {
                      <a
                        class="kl-btn-primary"
                        [routerLink]="['/bookings', b.id, 'payment']"
                        [attr.aria-label]="'Complete payment for booking ' + b.id"
                      >
                        Complete payment
                      </a>
                    }
                    @if (canCancel(b)) {
                      <button
                        type="button"
                        class="kl-btn-secondary kl-btn-danger"
                        [attr.aria-label]="'Cancel booking ' + b.id"
                        (click)="cancelBooking(b)"
                      >
                        Cancel booking
                      </button>
                    }
                  </div>
                </div>
              </article>
            </li>
          }
        </ul>
      }
    </main>
  `,
})
export class MyTripsPage implements OnInit {
  private readonly bookings = inject(BookingsApiService);

  readonly trips = signal<Booking[]>([]);
  readonly loaded = signal(false);
  readonly loadError = signal<string | null>(null);
  readonly emptyMessage = MY_TRIPS_EMPTY_MESSAGE;

  ngOnInit(): void {
    this.refreshTrips();
  }

  refreshTrips(): void {
    this.bookings.list().subscribe({
      next: (trips) => {
        this.trips.set(trips);
        this.loadError.set(null);
        this.loaded.set(true);
      },
      error: () => {
        this.loadError.set('Could not load trips.');
        this.loaded.set(true);
      },
    });
  }

  nameFor(b: Booking): string {
    return b.vehicleName?.trim() || b.vehicleId;
  }

  imageFor(b: Booking): string {
    const saved = b.vehicleImageUrl?.trim();
    if (saved) {
      return saved;
    }
    return b.vehicleId ? `/assets/vehicles/${b.vehicleId}.jpg` : '';
  }

  statusClass(status: BookingStatus): string {
    switch (status) {
      case 'Pending':
        return 'kl-badge kl-badge-pending';
      case 'Paid':
        return 'kl-badge kl-badge-paid';
      case 'Cancelled':
        return 'kl-badge kl-badge-cancelled';
    }
  }

  canCancel(b: Booking): boolean {
    return b.status === 'Pending' || b.status === 'Paid';
  }

  cancelBooking(b: Booking): void {
    if (!this.canCancel(b)) {
      return;
    }
    const message =
      b.status === 'Paid'
        ? 'Cancel this paid booking? This demo does not issue refunds.'
        : 'Cancel this booking?';
    if (!confirm(message)) {
      return;
    }
    this.bookings.cancel(b.id).subscribe({
      next: () => this.refreshTrips(),
      error: () => this.loadError.set('Could not cancel this booking.'),
    });
  }
}
