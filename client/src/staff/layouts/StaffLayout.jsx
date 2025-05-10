import { Outlet } from 'react-router-dom';
import StaffSidebar from '../components/StaffSidebar';
import StaffHeader from '../components/StaffHeader';

export default function StaffLayout() {
  return (
    <div className="flex min-h-screen bg-[#181818]">
      <StaffSidebar />
      <div className="flex-1 flex flex-col">
        <StaffHeader />
        <main className="flex-1 p-6 bg-[#181818]">
          <Outlet />
        </main>
      </div>
    </div>
  );
} 