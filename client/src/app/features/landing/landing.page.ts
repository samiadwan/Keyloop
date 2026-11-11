import { CurrencyPipe } from '@angular/common';
import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { LandingFaqComponent } from '../../core/components/landing-faq/landing-faq.component';
import { KeyloopLogoComponent } from '../../core/components/keyloop-logo/keyloop-logo.component';
import {
  LANDING_NO_VEHICLES_MESSAGE,
  LANDING_RESULTS_ALL,
  landingResultsInLocation,
} from '../../core/constants/trips-copy';
import { Vehicle } from '../../core/models/vehicle.model';
import { VehicleCatalogService } from '../../core/services/vehicle-catalog.service';
import { readSearchQuery, searchQueryParams, SearchQuery } from '../../core/utils/journey-context';
import { CATALOG_LOCATIONS, extractCatalogLocationFromDisplayText } from '../../core/utils/location-catalog';
import { validateSearchDates } from '../../core/utils/rental-dates';

@Component({
  selector: 'app-landing',
  imports: [CurrencyPipe, FormsModule, KeyloopLogoComponent, LandingFaqComponent, RouterLink],
  templateUrl: './landing.page.html',
})
export class LandingPage implements OnInit, OnDestroy {
  private readonly vehiclesApi = inject(VehicleCatalogService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private querySub?: Subscription;
  private loadRequestId = 0;

  readonly catalogLocations = CATALOG_LOCATIONS;
  location = '';
  pickupDate = '';
  returnDate = '';
  readonly vehicles = signal<Vehicle[]>([]);
  readonly loadError = signal<string | null>(null);
  readonly searchMessage = signal<string | null>(null);
  readonly loading = signal(false);
  private loadedLocation = '';

  ngOnInit(): void {
    this.querySub = this.route.queryParamMap.subscribe(() => {
      this.applyQueryFromRoute();
    });
  }

  ngOnDestroy(): void {
    this.querySub?.unsubscribe();
  }

  searchQueryParams() {
    return searchQueryParams({
      location: this.location,
      pickupDate: this.pickupDate,
      returnDate: this.returnDate,
    });
  }

  resultsHeading(): string | null {
    if (this.loading() || this.loadError()) {
      return null;
    }
    const loc = this.loadedLocation.trim();
    if (loc) {
      return landingResultsInLocation(this.vehicles().length, loc);
    }
    return LANDING_RESULTS_ALL;
  }

  onSearch(): void {
    this.searchMessage.set(null);
    const check = validateSearchDates(this.pickupDate, this.returnDate);
    if (!check.valid) {
      this.searchMessage.set(check.message ?? 'Invalid dates.');
      return;
    }

    const catalogCity = extractCatalogLocationFromDisplayText(this.location);
    const location = catalogCity ?? this.location.trim();
    void this.router.navigate([], {
      relativeTo: this.route,
      queryParams: searchQueryParams({
        location,
        pickupDate: this.pickupDate,
        returnDate: this.returnDate,
      }),
      replaceUrl: true,
    });
  }

  private applyQueryFromRoute(): void {
    const q = readSearchQuery(this.route);
    this.location = q.location;
    this.pickupDate = q.pickupDate;
    this.returnDate = q.returnDate;
    this.loadFromQuery(q);
  }

  private loadFromQuery(q: SearchQuery): void {
    const location = q.location.trim() || undefined;
    this.loadError.set(null);
    this.searchMessage.set(null);
    const requestId = ++this.loadRequestId;
    this.loading.set(true);
    this.vehiclesApi
      .getVehicles(location)
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (list) => {
          if (requestId !== this.loadRequestId) {
            return;
          }
          this.vehicles.set(list);
          this.loadedLocation = q.location;
          if (list.length === 0 && location) {
            this.searchMessage.set(LANDING_NO_VEHICLES_MESSAGE);
          }
        },
        error: () => {
          if (requestId !== this.loadRequestId) {
            return;
          }
          this.vehicles.set([]);
          this.loadedLocation = '';
          this.loadError.set('Could not load vehicles. Is the API running on port 5077?');
        },
      });
  }
}
