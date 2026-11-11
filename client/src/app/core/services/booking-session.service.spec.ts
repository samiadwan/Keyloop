import { afterEach, describe, expect, it } from 'vitest';
import { BookingSessionService } from './booking-session.service';

describe('BookingSessionService', () => {
  afterEach(() => {
    sessionStorage.clear();
  });

  it('UAT-5: assigns sequential TRP ids and keeps both bookings', () => {
    const svc = new BookingSessionService();
    const first = svc.createBooking({
      vehicleId: 'v1',
      pickupLocation: 'Sydney',
      pickupDate: '2030-01-01',
      returnDate: '2030-01-03',
    });
    const second = svc.createBooking({
      vehicleId: 'v2',
      pickupLocation: 'Melbourne',
      pickupDate: '2030-02-01',
      returnDate: '2030-02-04',
    });

    expect(first.id).toBe('TRP-001');
    expect(first.status).toBe('Pending');
    expect(second.id).toBe('TRP-002');
    expect(svc.load()).toHaveLength(2);
  });

  it('does not reuse an id after the higher booking remains', () => {
    const svc = new BookingSessionService();
    svc.createBooking({
      vehicleId: 'v1',
      pickupLocation: 'Sydney',
      pickupDate: '2030-01-01',
      returnDate: '2030-01-03',
    });
    svc.createBooking({
      vehicleId: 'v2',
      pickupLocation: 'Perth',
      pickupDate: '2030-03-01',
      returnDate: '2030-03-02',
    });

    const reloaded = new BookingSessionService();
    const third = reloaded.createBooking({
      vehicleId: 'v3',
      pickupLocation: 'Brisbane',
      pickupDate: '2030-04-01',
      returnDate: '2030-04-02',
    });
    expect(third.id).toBe('TRP-003');
  });

  it('updates one booking and leaves the other intact', () => {
    const svc = new BookingSessionService();
    const first = svc.createBooking({
      vehicleId: 'v1',
      pickupLocation: 'Sydney',
      pickupDate: '2030-01-01',
      returnDate: '2030-01-03',
    });
    svc.createBooking({
      vehicleId: 'v2',
      pickupLocation: 'Perth',
      pickupDate: '2030-03-01',
      returnDate: '2030-03-02',
    });

    svc.setStatus(first.id, 'Paid');

    expect(svc.getById(first.id)?.status).toBe('Paid');
    expect(svc.getById('TRP-002')?.status).toBe('Pending');
    expect(svc.getById('TRP-002')?.pickupLocation).toBe('Perth');
  });

  it('returns the same booking after a new service reads sessionStorage', () => {
    const svc = new BookingSessionService();
    svc.createBooking({
      vehicleId: 'v1',
      vehicleName: 'Toyota Corolla',
      pickupLocation: 'Sydney',
      pickupDate: '2030-01-01',
      returnDate: '2030-01-03',
    });

    const reloaded = new BookingSessionService();
    expect(reloaded.getById('TRP-001')?.vehicleName).toBe('Toyota Corolla');
  });

  it('saves a tier and total on that booking id only', () => {
    const svc = new BookingSessionService();
    const first = svc.createBooking({
      vehicleId: 'v1',
      pickupLocation: 'Sydney',
      pickupDate: '2030-01-01',
      returnDate: '2030-01-04',
    });
    svc.createBooking({
      vehicleId: 'v2',
      pickupLocation: 'Perth',
      pickupDate: '2030-03-01',
      returnDate: '2030-03-02',
    });

    svc.updateBooking(first.id, {
      insuranceTier: 'Standard',
      chargeBreakdown: {
        dailyPriceUsd: 100,
        rentalDays: 3,
        baseUsd: 300,
        insuranceUsd: 1000,
        platformFeeUsd: 5,
        totalUsd: 1305,
      },
    });

    expect(svc.getById('TRP-001')?.insuranceTier).toBe('Standard');
    expect(svc.getById('TRP-001')?.chargeBreakdown?.totalUsd).toBe(1305);
    expect(svc.getById('TRP-002')?.insuranceTier).toBeUndefined();
    expect(svc.getById('TRP-002')?.pickupLocation).toBe('Perth');
  });

  it('returns undefined for an unknown id', () => {
    const svc = new BookingSessionService();
    expect(svc.getById('TRP-001')).toBeUndefined();
  });
});
