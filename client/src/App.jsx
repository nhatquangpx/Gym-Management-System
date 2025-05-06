import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './components/LoginPage/LoginPage';
import RegisterPackage from './components/RegisterPackage/RegisterPackage';
import RegisterPT from './components/RegisterPT/RegisterPT';
import RegisterAccount from './components/RegisterAccount/RegisterAccount';
import RegisterPersonal from './components/RegisterPersonal/RegisterPersonal';
import RegisterConfirm from './components/RegisterConfirm/RegisterConfirm';
import RegisterConsult from './components/RegisterConsult/RegisterConsult';
import PaymentPage from './components/PaymentPage/PaymentPage';

// Placeholder components cho các trang khác
const RegisterPage = () => <div>Register Page (Coming soon)</div>;
const Dashboard = () => <div>Dashboard Page</div>;
const MemberManagement = () => <div>Member Management Page</div>;
const EquipmentManagement = () => <div>Equipment Management Page</div>;
const StaffManagement = () => <div>Staff Management Page</div>;
const PackageManagement = () => <div>Package Management Page</div>;
const NotFound = () => <div>404 - Page Not Found</div>;

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginPage />} />
        {/* Luồng đăng ký */}
        <Route path="/register/package" element={<RegisterPackage />} />
        <Route path="/register/pt" element={<RegisterPT />} />
        <Route path="/register/account" element={<RegisterAccount />} />
        <Route path="/register/personal" element={<RegisterPersonal />} />
        <Route path="/register/confirm" element={<RegisterConfirm />} />
        <Route path="/register/consult" element={<RegisterConsult />} />
        {/* Trang thanh toán */}
        <Route path="/payment" element={<PaymentPage />} />
        {/* Các route khác */}
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/members" element={<MemberManagement />} />
        <Route path="/equipment" element={<EquipmentManagement />} />
        <Route path="/staff" element={<StaffManagement />} />
        <Route path="/packages" element={<PackageManagement />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
