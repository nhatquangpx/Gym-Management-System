import { Outlet } from 'react-router-dom';
import StaffSidebar from "../features/staff/StaffSidebar";
import StaffHeader from "../features/staff/StaffHeader";

export default function StaffLayout() {
  return (
    <div className="flex min-h-screen bg-[var(--admin-bg)]">
      <StaffSidebar />
      <div className="flex-1 flex flex-col">
        <StaffHeader />
        <main className="flex-1 p-6 bg-[var(--admin-bg)]">
          <Outlet />
        </main>
      </div>
    </div>
  );
} 