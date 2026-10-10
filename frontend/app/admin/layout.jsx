import RequireAuth from '@/components/dashboard/RequireAuth';
import AdminNav from '@/components/admin/AdminNav';

export const metadata = {
  title: "Admin console — Cee's Deliveries",
};

export default function AdminLayout({ children }) {
  return (
    <RequireAuth roles={['ADMIN']}>
      <div className="mx-auto max-w-[100rem] px-[55px] py-10 sm:py-14">
        <div className="grid gap-8 lg:grid-cols-[240px_1fr] lg:gap-12">
          <AdminNav />
          <div className="min-w-0">{children}</div>
        </div>
      </div>
    </RequireAuth>
  );
}
