import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { of } from 'rxjs';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { Vehicle } from '../../core/models/vehicle.model';
import { VehicleCatalogService } from '../../core/services/vehicle-catalog.service';
import { VehicleDetailPage } from './vehicle-detail.page';

const vehicle: Vehicle = {
  id: 'v1',
  name: 'Toyota Corolla',
  imageUrl: '/assets/vehicles/v1.jpg',
  location: 'Sydney',
  dailyPriceUsd: 49,
  features: [],
  rules: [],
};

describe('VehicleDetailPage', () => {
  afterEach(() => {
    TestBed.inject(HttpTestingController).verify();
  });

  async function openDetail(): Promise<VehicleDetailPage> {
    await TestBed.configureTestingModule({
      imports: [VehicleDetailPage],
      providers: [
        provideRouter([{ path: 'vehicles/:id', component: VehicleDetailPage }]),
        provideHttpClient(),
        provideHttpClientTesting(),
        {
          provide: VehicleCatalogService,
          useValue: { getVehicle: () => of(vehicle) },
        },
      ],
    }).compileComponents();
    const harness = await RouterTestingHarness.create();
    return harness.navigateByUrl('/vehicles/v1?location=Sydney', VehicleDetailPage);
  }

  it('UAT-3: Continue booking stays disabled when dates are missing', async () => {
    const page = await openDetail();
    const http = TestBed.inject(HttpTestingController);
    expect(page.canContinue()).toBe(false);
    page.onContinue();
    http.expectNone('http://localhost:5077/api/bookings');
  });

  it('UAT-4: a return date on or before pickup shows an error and creates nothing', async () => {
    const page = await openDetail();
    const http = TestBed.inject(HttpTestingController);
    page.pickupDate = '2030-01-10';
    page.returnDate = '2030-01-10';
    expect(page.dateMessage()).toBe('Return date must be after pickup date.');
    expect(page.canContinue()).toBe(false);
    page.onContinue();
    http.expectNone('http://localhost:5077/api/bookings');
  });

  it('creates a Pending booking and opens its payment route', async () => {
    const page = await openDetail();
    const router = TestBed.inject(Router);
    const navigate = vi.spyOn(router, 'navigate').mockResolvedValue(true);
    page.pickupDate = '2030-01-01';
    page.returnDate = '2030-01-05';
    page.onContinue();

    const http = TestBed.inject(HttpTestingController);
    const request = http.expectOne('http://localhost:5077/api/bookings');
    expect(request.request.method).toBe('POST');
    expect(request.request.body).toMatchObject({
      vehicleId: 'v1',
      vehicleName: 'Toyota Corolla',
      pickupLocation: 'Sydney',
      pickupDate: '2030-01-01',
      returnDate: '2030-01-05',
    });
    request.flush({
      id: 'TRP-001',
      vehicleId: 'v1',
      vehicleName: 'Toyota Corolla',
      vehicleImageUrl: '/assets/vehicles/v1.jpg',
      pickupLocation: 'Sydney',
      pickupDate: '2030-01-01',
      returnDate: '2030-01-05',
      status: 'Pending',
      createdAt: '2030-01-01T00:00:00Z',
      insuranceTier: null,
      chargeBreakdown: null,
    });

    expect(navigate).toHaveBeenCalledWith(['/bookings', 'TRP-001', 'payment']);
  });
});
