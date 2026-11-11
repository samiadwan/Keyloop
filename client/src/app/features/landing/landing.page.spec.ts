import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter, Router } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { of } from 'rxjs';
import { vi } from 'vitest';
import { Vehicle } from '../../core/models/vehicle.model';
import { VehicleCatalogService } from '../../core/services/vehicle-catalog.service';
import { LandingPage } from './landing.page';

const stubVehicle: Vehicle = {
  id: 'v1',
  name: 'Test Car',
  location: 'Sydney',
  dailyPriceUsd: 50,
  imageUrl: '/assets/vehicles/v1.jpg',
  features: [],
  rules: [],
};

describe('LandingPage', () => {
  let getVehicles: ReturnType<typeof vi.fn>;

  beforeEach(async () => {
    getVehicles = vi.fn(() => of([stubVehicle]));
    await TestBed.configureTestingModule({
      imports: [LandingPage],
      providers: [
        provideRouter([{ path: '', component: LandingPage }]),
        provideHttpClient(),
        { provide: VehicleCatalogService, useValue: { getVehicles } },
      ],
    }).compileComponents();
  });

  it('loads vehicles on init', async () => {
    const harness = await RouterTestingHarness.create();
    const component = await harness.navigateByUrl('/', LandingPage);
    expect(getVehicles).toHaveBeenCalled();
    expect(component.vehicles().length).toBe(1);
  });

  it('onSearch with invalid dates does not navigate', async () => {
    const harness = await RouterTestingHarness.create();
    const component = await harness.navigateByUrl('/', LandingPage);
    const router = TestBed.inject(Router);
    const navigate = vi.spyOn(router, 'navigate').mockResolvedValue(true);
    component.pickupDate = '2030-01-10';
    component.returnDate = '2030-01-01';
    component.onSearch();
    expect(navigate).not.toHaveBeenCalled();
    expect(component.searchMessage()).toBeTruthy();
  });

  it('onSearch with valid dates writes location and dates to the URL', async () => {
    const harness = await RouterTestingHarness.create();
    const component = await harness.navigateByUrl('/', LandingPage);
    const router = TestBed.inject(Router);
    const navigate = vi.spyOn(router, 'navigate').mockResolvedValue(true);
    component.location = 'Sydney, New South Wales, Australia';
    component.pickupDate = '2030-01-01';
    component.returnDate = '2030-01-05';
    component.onSearch();
    expect(navigate).toHaveBeenCalledWith(
      [],
      expect.objectContaining({
        queryParams: {
          location: 'Sydney',
          pickupDate: '2030-01-01',
          returnDate: '2030-01-05',
        },
        replaceUrl: true,
      }),
    );
  });
});
