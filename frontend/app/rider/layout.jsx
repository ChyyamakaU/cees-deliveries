import RequireAuth from '@/components/dashboard/RequireAuth';

export const metadata = {
  title: "Rider hub — Cee's Deliveries",
};

export default function RiderLayout({ children }) {
  return (
    <RequireAuth roles={['RIDER']}>
      <div className="mx-auto max-w-[100rem] px-[55px] py-10 sm:py-14">{children}</div>
    </RequireAuth>
  );
}
