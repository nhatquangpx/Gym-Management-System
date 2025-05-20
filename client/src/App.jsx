import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage/LoginPage';
import RegisterPackagePage from './pages/RegisterPackagePage/RegisterPackagePage';
import RegisterPTPage from './pages/RegisterPTPage/RegisterPTPage';
import RegisterAccountPage from './pages/RegisterAccountPage/RegisterAccountPage';
import RegisterPersonalPage from './pages/RegisterPersonalPage/RegisterPersonalPage';
import RegisterConfirmPage from './pages/RegisterConfirmPage/RegisterConfirmPage';
import RegisterConsultPage from './pages/RegisterConsultPage/RegisterConsultPage';
import PaymentPage from './pages/PaymentPage/PaymentPage';
import PaymentReturnPage from './pages/PaymentReturnPage/PaymentReturnPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage/ForgotPasswordPage';
import ResetPasswordSentPage from './pages/ResetPasswordSentPage/ResetPasswordSentPage';
import NotFoundPage from './pages/NotFoundPage/NotFoundPage';
import EditProfilePage from './pages/EditProfilePage/EditProfilePage';
import SchedulePage from './pages/SchedulePage/SchedulePage'; // Trang mới
import MyPackagesPage from './pages/MyPackagesPage/MyPackagesPage';
import ComplaintsPage from './pages/ComplaintsPage/ComplaintsPage';

import HomePage from './pages/HomePage/HomePage'; // Giả sử bạn tạo HomePage trong thư mục pages


// Admin components
import AdminLayout from './admin/components/AdminLayout';
import AdminLogin from './admin/pages/Login';
import AdminDashboard from './admin/pages/Dashboard';
import AdminMembers from './admin/pages/Members';
import AdminEmployees from './admin/pages/Employees';
import AdminPackages from './admin/pages/Packages';
import AdminOrders from './admin/pages/Orders';
import AdminStatistics from './admin/pages/Statistics';
import AdminSettings from './admin/pages/Settings';
import AdminProfile from './admin/pages/Profile';
import AdminAccount from './admin/pages/Account';
import ViewMember from './admin/pages/ViewMember';
import EditMember from './admin/pages/EditMember';
import ViewEmployee from './admin/pages/ViewEmployee';
import EditEmployee from './admin/pages/EditEmployee';
import ViewPackage from './admin/pages/ViewPackage';
import EditPackage from './admin/pages/EditPackage';
import ViewOrder from './admin/pages/ViewOrder';
import EditOrder from './admin/pages/EditOrder';
import EditProfile from './admin/pages/EditProfile';
import AdminEquipment from './admin/pages/Equipment';
import AdminFeedback from './admin/pages/Feedback';
import AdminWorkouts from './admin/pages/Workouts';
import AdminSchedules from './admin/pages/Schedules';
import ViewEquipment from './admin/pages/ViewEquipment';
import EditEquipment from './admin/pages/EditEquipment';
import ViewFeedback from './admin/pages/ViewFeedback';
import ViewWorkout from './admin/pages/ViewWorkout';
import EditWorkout from './admin/pages/EditWorkout';
import EquipmentList from './admin/pages/EquipmentList';
import WorkoutList from './admin/pages/WorkoutList';
import ScheduleList from './admin/pages/ScheduleList';
import ViewSchedule from './admin/pages/ViewSchedule';
import EditSchedule from './admin/pages/EditSchedule';

// Placeholder components cho các trang khác
const RegisterPage = () => <div>Register Page (Coming soon)</div>;
const Dashboard = () => <div>Dashboard Page</div>;
const MemberManagement = () => <div>Member Management Page</div>;
const EquipmentManagement = () => <div>Equipment Management Page</div>;
const StaffManagement = () => <div>Staff Management Page</div>;
const PackageManagement = () => <div>Package Management Page</div>;

// Các trang chức năng từ Navbar
const NotificationPage = () => <div>Trang Thông báo</div>;
// Trang chỉnh sửa thông tin, cài đặt
const SettingsPage = () => <div>Trang Cài đặt</div>;


import StaffLayout from './staff/layouts/StaffLayout';
import StaffDashboard from './staff/pages/Dashboard';
import StaffMembers from './staff/pages/Members';
import StaffPackages from './staff/pages/Packages';
import StaffEquipment from './staff/pages/Equipment';
import StaffWorkouts from './staff/pages/Workouts';
import StaffSchedules from './staff/pages/Schedules';
import StaffFeedback from './staff/pages/Feedback';
import StaffStatistics from './staff/pages/Statistics';
import StaffAccount from './staff/pages/Account';
import AddMember from './staff/pages/AddMember';
import AddPackage from './staff/pages/AddPackage';
import AddEquipment from './staff/pages/AddEquipment';

import { AuthProvider } from './contexts/AuthContext';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
        {/* Đặt HomePage làm trang mặc định */}
          <Route path="/" element={<HomePage />} /> 
        <Route path="/login" element={<LoginPage />} />
        
        {/* Luồng quên mật khẩu */}
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password-sent" element={<ResetPasswordSentPage />} />

        {/* Luồng đăng ký */}
        <Route path="/register/package" element={<RegisterPackagePage />} />
        <Route path="/register/pt" element={<RegisterPTPage />} />
        <Route path="/register/account" element={<RegisterAccountPage />} />
        <Route path="/register/personal" element={<RegisterPersonalPage />} />
        <Route path="/register/confirm" element={<RegisterConfirmPage />} />
        <Route path="/register/consult" element={<RegisterConsultPage />} />
          {/* Trang thanh toán */}
        <Route path="/payment" element={<PaymentPage />} />
        <Route path="/payment/return" element={<PaymentReturnPage />} />

        {/* Các route chức năng từ Navbar */}
        <Route path="/schedule" element={<SchedulePage />} />
        <Route path="/my-packages" element={<MyPackagesPage />} />
        <Route path="/notifications" element={<NotificationPage />} />
        <Route path="/complaints" element={<ComplaintsPage />} />
        {/* Route cho các mục trong dropdown user */}
        <Route path="/profile/edit" element={<EditProfilePage />} />
        <Route path="/settings" element={<SettingsPage />} />
        
        {/* Các route khác */}
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/members" element={<MemberManagement />} />
        <Route path="/equipment" element={<EquipmentManagement />} />
        <Route path="/staff" element={<StaffLayout />}>
          <Route path="dashboard" element={<StaffDashboard />} />
          <Route path="members" element={<StaffMembers />} />
          <Route path="members/add" element={<AddMember />} />
          <Route path="packages" element={<StaffPackages />} />
          <Route path="packages/add" element={<AddPackage />} />
          <Route path="equipment" element={<StaffEquipment />} />
          <Route path="equipment/add" element={<AddEquipment />} />
          <Route path="workouts" element={<StaffWorkouts />} />
          <Route path="schedules" element={<StaffSchedules />} />
          <Route path="feedback" element={<StaffFeedback />} />
          <Route path="statistics" element={<StaffStatistics />} />
          <Route path="account" element={<StaffAccount />} />
        </Route>
        <Route path="/packages" element={<PackageManagement />} />

        {/* Admin routes */}
        <Route path="/admin" element={<Navigate to="/admin/login" replace />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        
        {/* Admin routes và layout */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="members" element={<AdminMembers />} />
          <Route path="members/view/:id" element={<ViewMember />} />
          <Route path="members/edit/:id" element={<EditMember />} />
          <Route path="employees" element={<AdminEmployees />} />
          <Route path="employees/view/:id" element={<ViewEmployee />} />
          <Route path="employees/edit/:id" element={<EditEmployee />} />
          <Route path="packages" element={<AdminPackages />} />
          <Route path="packages/view/:id" element={<ViewPackage />} />
          <Route path="packages/edit/:id" element={<EditPackage />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="orders/view/:id" element={<ViewOrder />} />
          <Route path="orders/edit/:id" element={<EditOrder />} />
          <Route path="equipment" element={<EquipmentList />} />
          <Route path="equipment/view/:id" element={<ViewEquipment />} />
          <Route path="equipment/edit/:id" element={<EditEquipment />} />
          <Route path="equipment/add" element={<EditEquipment />} />
          <Route path="workouts" element={<WorkoutList />} />
          <Route path="workouts/view/:id" element={<ViewWorkout />} />
          <Route path="workouts/edit/:id" element={<EditWorkout />} />
          <Route path="workouts/add" element={<EditWorkout />} />
          <Route path="schedules" element={<ScheduleList />} />
          <Route path="schedules/view/:id" element={<ViewSchedule />} />
          <Route path="schedules/edit/:id" element={<EditSchedule />} />
          <Route path="schedules/add" element={<EditSchedule />} />
          <Route path="feedback" element={<AdminFeedback />} />
          <Route path="feedback/view/:id" element={<ViewFeedback />} />
          <Route path="statistics" element={<AdminStatistics />} />
          <Route path="settings" element={<AdminSettings />} />
          <Route path="profile" element={<AdminProfile />} />
          <Route path="profile/edit" element={<EditProfile />} />
          <Route path="account" element={<AdminAccount />} />
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
    </AuthProvider>
  );
}

export default App;
