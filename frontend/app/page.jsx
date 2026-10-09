import Hero from '@/components/Hero';
import Categories from '@/components/Categories';
import HowItWorks from '@/components/HowItWorks';
import TrackDelivery from '@/components/TrackDelivery';
import Benefits from '@/components/Benefits';

export default function HomePage() {
  return (
    <main>
      <Hero />
      <Categories />
      <HowItWorks />
      <TrackDelivery />
      <Benefits />
    </main>
  );
}
