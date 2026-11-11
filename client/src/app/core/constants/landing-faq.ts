export interface LandingFaqItem {
  id: string;
  question: string;
  answer: string;
}

export const LANDING_FAQ_ITEMS: LandingFaqItem[] = [
  {
    id: 'how-book',
    question: 'How do I book a vehicle?',
    answer:
      'Search by pickup city, choose dates, open a vehicle, and tap Continue booking. You can add insurance on the payment page and pay with Stripe Checkout in test mode.',
  },
  {
    id: 'payment-real',
    question: 'Is checkout a real payment?',
    answer:
      'No. This demo uses Stripe in test mode only. Use Stripe test cards — no real money is charged.',
  },
  {
    id: 'search-dates',
    question: 'Do pickup and return dates filter search results?',
    answer:
      'Location filters the catalogue. Dates validate your rental window and carry through booking, but they do not remove vehicles from search results.',
  },
  {
    id: 'trips',
    question: 'Where are my bookings saved?',
    answer:
      'Bookings for this demo live in your browser for the current tab. A closed tab starts empty. That is expected for this demo.',
  },
  {
    id: 'cancel',
    question: 'Can I cancel a booking?',
    answer:
      'Yes. From My Trips you can cancel Pending or Paid bookings. Cancelled trips stay in the list with an updated status.',
  },
];
