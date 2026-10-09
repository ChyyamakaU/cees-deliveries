import RequireAuth from '@/components/dashboard/RequireAuth';
import DashboardNav from '@/components/dashboard/DashboardNav';

export const metadata = {
  title: "Dashboard — Cee's Deliveries",
};

export default function DashboardLayout({ children }) {
  return (
    <RequireAuth>
      <div className="mx-auto max-w-[100rem] px-4 py-10 sm:px-6 sm:py-14">
        <div className="grid gap-8 lg:grid-cols-[240px_1fr] lg:gap-12">
          <DashboardNav />
          <div className="min-w-0">{children}</div>
        </div>
      </div>
    </RequireAuth>
  );
}
