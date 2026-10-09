import LegalPage from '@/components/LegalPage';

export const metadata = {
  title: "Privacy Policy — Cee's Deliveries",
};

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      updated="January 2026"
      intro="How the Cee's Deliveries demo handles information you enter. This is placeholder text for the demo build."
      sections={[
        {
          heading: '1. Information we collect',
          body: [
            'When you book or track a delivery, the platform stores the details you provide, such as account details, pickup and destination addresses, recipient information and item descriptions.',
            'In this demo build, data is stored in a local development database for demonstration purposes only.',
          ],
        },
        {
          heading: '2. How information is used',
          body: [
            'Your information is used to create, assign and track deliveries, and to show order history in your dashboard.',
            'This placeholder document should be replaced with reviewed privacy copy before launch.',
          ],
        },
        {
          heading: '3. Your choices',
          body: [
            'You can update your profile and account settings from your dashboard.',
            'No third-party analytics or advertising trackers are included in this demo.',
          ],
        },
      ]}
    />
  );
}
