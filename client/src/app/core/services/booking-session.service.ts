import { Injectable } from '@angular/core';
import { Booking, BookingStatus, NewBooking } from '../models/booking.model';

const STORAGE_KEY = 'keyloop.bookings.v1';

@Injectable({ providedIn: 'root' })
export class BookingSessionService {
  private nextSequence = 1;

  load(): Booking[] {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) {
      this.nextSequence = 1;
      return [];
    }
    try {
      const bookings = JSON.parse(raw) as Booking[];
      this.nextSequence = this.deriveNextSequence(bookings);
      return bookings;
    } catch {
      this.nextSequence = 1;
      return [];
    }
  }

  save(bookings: Booking[]): void {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(bookings));
    this.nextSequence = this.deriveNextSequence(bookings);
  }

  createBooking(input: NewBooking): Booking {
    const bookings = this.load();
    const booking: Booking = {
      ...input,
      id: this.formatId(this.nextSequence),
      status: 'Pending',
      createdAt: new Date().toISOString(),
    };
    bookings.push(booking);
    this.save(bookings);
    return booking;
  }

  updateBooking(id: string, patch: Partial<Omit<Booking, 'id'>>): Booking | undefined {
    const bookings = this.load();
    const index = bookings.findIndex((booking) => booking.id === id);
    if (index < 0) {
      return undefined;
    }
    const current = bookings[index];
    bookings[index] = { ...current, ...patch, id: current.id };
    this.save(bookings);
    return bookings[index];
  }

  setStatus(id: string, status: BookingStatus): Booking | undefined {
    return this.updateBooking(id, { status });
  }

  getById(id: string): Booking | undefined {
    return this.load().find((booking) => booking.id === id);
  }

  private deriveNextSequence(bookings: Booking[]): number {
    let max = 0;
    for (const booking of bookings) {
      const n = Number.parseInt(booking.id.replace('TRP-', ''), 10);
      if (!Number.isNaN(n)) {
        max = Math.max(max, n);
      }
    }
    return max + 1;
  }

  private formatId(n: number): string {
    return `TRP-${String(n).padStart(3, '0')}`;
  }
}
