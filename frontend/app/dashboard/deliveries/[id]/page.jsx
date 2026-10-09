import DeliveryDetail from '@/components/dashboard/DeliveryDetail';

export const metadata = {
  title: "Delivery details — Cee's Deliveries",
};

export default async function DeliveryDetailPage({ params }) {
  const { id } = await params;
  return <DeliveryDetail id={id} />;
}
