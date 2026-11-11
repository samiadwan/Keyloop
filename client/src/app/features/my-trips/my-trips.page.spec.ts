import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { MY_TRIPS_EMPTY_MESSAGE } from '../../core/constants/trips-copy';
import { Booking } from '../../core/models/booking.model';
import { MyTripsPage } from './my-trips.page';

function trip(id: string, status: Booking['status'], name: string): Booking {
  return {
    id,
    vehicleId: 'v1',
    vehicleName: name,
    pickupLocation: 'Sydney',
    pickupDate: '2030-01-01',
    returnDate: '2030-01-04',
    status,
    createdAt: '2030-01-01T00:00:00Z',
  };
}

describe('MyTripsPage', () => {
  let fixture: ComponentFixture<MyTripsPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyTripsPage],
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();
  });

  afterEach(() => {
    TestBed.inject(HttpTestingController).verify();
    vi.restoreAllMocks();
  });

  function render(rows: Booking[]): void {
    fixture = TestBed.createComponent(MyTripsPage);
    fixture.detectChanges();
    const http = TestBed.inject(HttpTestingController);
    http.expectOne('http://localhost:5077/api/bookings').flush(rows);
    fixture.detectChanges();
  }

  it('shows the exact empty message when no bookings are stored', () => {
    render([]);
    const text = fixture.nativeElement.textContent as string;
    expect(text).toContain(MY_TRIPS_EMPTY_MESSAGE);
    expect(fixture.nativeElement.querySelector('a.kl-btn-primary')?.textContent).toContain('Browse vehicles');
  });

  it('lists every booking returned by the API', () => {
    render([trip('TRP-001', 'Pending', 'Toyota Corolla'), trip('TRP-002', 'Paid', 'Hyundai i30')]);
    const text = fixture.nativeElement.textContent as string;
    expect(text).toContain('Toyota Corolla');
    expect(text).toContain('Hyundai i30');
    expect(text).toContain('TRP-001');
    expect(text).toContain('TRP-002');
    expect(text).toContain('Pending');
    expect(text).toContain('Paid');
    expect(text).not.toContain(MY_TRIPS_EMPTY_MESSAGE);
  });

  it('cancels one booking through the API', () => {
    render([trip('TRP-001', 'Pending', 'Toyota Corolla'), trip('TRP-002', 'Pending', 'Hyundai i30')]);
    vi.spyOn(window, 'confirm').mockReturnValue(true);
    const cancel = fixture.nativeElement.querySelector(
      'button[aria-label="Cancel booking TRP-001"]',
    ) as HTMLButtonElement;
    cancel.click();

    const http = TestBed.inject(HttpTestingController);
    const request = http.expectOne('http://localhost:5077/api/bookings/TRP-001/cancel');
    expect(request.request.method).toBe('POST');
    request.flush(trip('TRP-001', 'Cancelled', 'Toyota Corolla'));
    http.expectOne('http://localhost:5077/api/bookings').flush([
      trip('TRP-001', 'Cancelled', 'Toyota Corolla'),
      trip('TRP-002', 'Pending', 'Hyundai i30'),
    ]);
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Cancelled');
    expect(fixture.nativeElement.querySelector('a[aria-label="Complete payment for booking TRP-001"]')).toBeNull();
    expect(fixture.nativeElement.querySelector('a[aria-label="Complete payment for booking TRP-002"]')).toBeTruthy();
  });
});
