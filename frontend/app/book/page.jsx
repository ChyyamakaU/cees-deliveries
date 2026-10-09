import { Suspense } from 'react';
import BookingFlow from '@/components/booking/BookingFlow';

export const metadata = {
  title: "Book a delivery — Cee's Deliveries",
  description:
    'Book food, grocery, package or courier deliveries in a few simple steps and get an upfront estimate.',
};

export default function BookPage() {
  return (
    <Suspense fallback={null}>
      <BookingFlow />
    </Suspense>
  );
}
