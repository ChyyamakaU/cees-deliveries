import LegalPage from '@/components/LegalPage';

export const metadata = {
  title: "Terms of Service — Cee's Deliveries",
};

export default function TermsPage() {
  return (
    <LegalPage
      title="Terms of Service"
      updated="January 2026"
      intro="These terms outline how the Cee's Deliveries demo platform may be used. This is placeholder text for the demo build."
      sections={[
        {
          heading: '1. Using the service',
          body: [
            'Cee\'s Deliveries provides a platform for requesting food, grocery, package and courier deliveries. By booking a delivery you agree to provide accurate pickup and recipient details.',
            'You are responsible for ensuring that items handed to riders are legal, safely packaged and permitted for transport.',
          ],
        },
        {
          heading: '2. Pricing and payment',
          body: [
            'Any prices shown during the booking flow are estimates based on the available pricing logic and are clearly labelled as estimates until a delivery is confirmed.',
            'Payment integrations are not part of this demo build. No real payments are processed.',
          ],
        },
        {
          heading: '3. Deliveries and liability',
          body: [
            'Estimated delivery times are indicative and may change due to traffic, weather or other conditions.',
            'This placeholder document does not create binding obligations and should be replaced with reviewed terms before launch.',
          ],
        },
      ]}
    />
  );
}
