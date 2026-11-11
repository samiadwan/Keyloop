import { CurrencyPipe } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { KeyloopLogoComponent } from '../../core/components/keyloop-logo/keyloop-logo.component';
import { VehicleLocationMapComponent } from '../../core/components/vehicle-location-map/vehicle-location-map.component';
import { Vehicle } from '../../core/models/vehicle.model';
import { BookingsApiService } from '../../core/services/bookings-api.service';
import { VehicleCatalogService } from '../../core/services/vehicle-catalog.service';
import { readSearchQuery, searchQueryParams } from '../../core/utils/journey-context';
import { validateRentalDates } from '../../core/utils/rental-dates';

@Component({
  selector: 'app-vehicle-detail',
  imports: [CurrencyPipe, FormsModule, KeyloopLogoComponent, RouterLink, VehicleLocationMapComponent],
  template: `
    <header class="kl-page-header">
      <nav class="kl-nav" aria-label="Primary">
        <app-keyloop-logo />
        <a routerLink="/trips" class="kl-btn-secondary">Trips</a>
      </nav>
    </header>
    <main id="main-content" tabindex="-1">
      @if (error()) {
        <section class="kl-card">
          <p class="kl-alert-error" role="alert">{{ error() }}</p>
        </section>
      } @else if (vehicle(); as v) {
        <div class="kl-detail">
          <img class="kl-detail-image" [src]="v.imageUrl" [alt]="v.name" />
          <div class="kl-card kl-detail-body">
            <section class="kl-detail-info">
              <a class="kl-btn-secondary kl-detail-back" routerLink="/" [queryParams]="backQuery()">Back to search</a>
              <h1>{{ v.name }}</h1>
              <h2>Vehicle features</h2>
              <ul class="kl-detail-list">
                @for (feature of v.features; track feature) {
                  <li>{{ feature }}</li>
                }
              </ul>
            <h2>Rental rules</h2>
            <ul class="kl-detail-list">
              @for (rule of v.rules; track rule) {
                <li>{{ rule }}</li>
              }
            </ul>
          </section>
            <section class="kl-detail-book">
              <h2>Book this vehicle</h2>
              <dl class="kl-detail-facts">
                <div>
                  <dt>Location</dt>
                  <dd>{{ v.location }}</dd>
                </div>
                <div>
                  <dt>Daily price</dt>
                  <dd>{{ v.dailyPriceUsd | currency: 'USD' }} / day</dd>
                </div>
              </dl>
              <label class="kl-label">
                Pickup location
                <input class="kl-input" name="location" [(ngModel)]="location" />
              </label>
              <label class="kl-label">
                Pickup date
                <input class="kl-input" type="date" name="pickupDate" [(ngModel)]="pickupDate" />
              </label>
              <label class="kl-label">
                Return date
                <input class="kl-input" type="date" name="returnDate" [(ngModel)]="returnDate" />
              </label>
              @if (dateMessage(); as message) {
                <p class="kl-alert-error" role="alert">{{ message }}</p>
              }
              <button type="button" class="kl-btn-primary" [disabled]="!canContinue()" (click)="onContinue()">
                Continue booking
              </button>
            </section>
            <app-vehicle-location-map [city]="v.location" [label]="v.name" />
          </div>
        </div>
      } @else {
        <section class="kl-card">
          <p role="status">Loading vehicle…</p>
        </section>
      }
    </main>
  `,
})
export class VehicleDetailPage implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly vehiclesApi = inject(VehicleCatalogService);
  private readonly bookings = inject(BookingsApiService);

  readonly vehicle = signal<Vehicle | null>(null);
  readonly error = signal<string | null>(null);
  location = '';
  pickupDate = '';
  returnDate = '';

  ngOnInit(): void {
    const query = readSearchQuery(this.route);
    this.location = query.location;
    this.pickupDate = query.pickupDate;
    this.returnDate = query.returnDate;

    const id = this.route.snapshot.paramMap.get('id') ?? '';
    this.vehiclesApi.getVehicle(id).subscribe({
      next: (vehicle) => this.vehicle.set(vehicle),
      error: () => this.error.set('Vehicle not found.'),
    });
  }

  backQuery() {
    return searchQueryParams({
      location: this.location,
      pickupDate: this.pickupDate,
      returnDate: this.returnDate,
    });
  }

  canContinue(): boolean {
    if (!this.vehicle()) {
      return false;
    }
    return validateRentalDates(this.pickupDate, this.returnDate).valid;
  }

  dateMessage(): string | null {
    if (!this.pickupDate && !this.returnDate) {
      return null;
    }
    const check = validateRentalDates(this.pickupDate, this.returnDate);
    return check.valid ? null : (check.message ?? 'Invalid dates.');
  }

  onContinue(): void {
    const vehicle = this.vehicle();
    if (!vehicle || !this.canContinue()) {
      return;
    }
    this.bookings
      .create({
        vehicleId: vehicle.id,
        vehicleName: vehicle.name,
        vehicleImageUrl: vehicle.imageUrl,
        pickupLocation: this.location.trim() || vehicle.location,
        pickupDate: this.pickupDate,
        returnDate: this.returnDate,
      })
      .subscribe({
        next: (booking) => {
          void this.router.navigate(['/bookings', booking.id, 'payment']);
        },
        error: () => this.error.set('Could not save this booking.'),
      });
  }
}
