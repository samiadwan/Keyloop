import { Routes } from '@angular/router';
import { CheckoutPage } from './features/checkout/checkout.page';
import { LandingPage } from './features/landing/landing.page';
import { MyTripsPage } from './features/my-trips/my-trips.page';
import { PaymentDetailsPage } from './features/payment-details/payment-details.page';
import { VehicleDetailPage } from './features/vehicle-detail/vehicle-detail.page';

export const routes: Routes = [
  { path: '', component: LandingPage, title: 'Keyloop – Browse vehicles' },
  { path: 'vehicles/:id', component: VehicleDetailPage, title: 'Keyloop – Vehicle details' },
  {
    path: 'bookings/:bookingId/payment',
    component: PaymentDetailsPage,
    title: 'Keyloop – Payment details',
  },
  { path: 'bookings/:bookingId/checkout', component: CheckoutPage, title: 'Keyloop – Checkout' },
  { path: 'trips', component: MyTripsPage, title: 'Keyloop – My booked trips' },
  { path: '**', redirectTo: '' },
];
