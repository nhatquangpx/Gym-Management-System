import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import PrivateRoute from './components/PrivateRoute';

// Member pages
import LoginPage from './pages/member/LoginPage/LoginPage';
import RegisterPackagePage from './pages/member/RegisterPackagePage/RegisterPackagePage';
import RegisterPTPage from './pages/member/RegisterPTPage/RegisterPTPage';
import RegisterAccountPage from './pages/member/RegisterAccountPage/RegisterAccountPage';
import RegisterPersonalPage from './pages/member/RegisterPersonalPage/RegisterPersonalPage';
import RegisterConfirmPage from './pages/member/RegisterConfirmPage/RegisterConfirmPage';
import RegisterConsultPage from './pages/member/RegisterConsultPage/RegisterConsultPage';
import PaymentPage from './pages/member/PaymentPage/PaymentPage';
import PaymentReturnPage from './pages/member/PaymentReturnPage/PaymentReturnPage';
import ForgotPasswordPage from './pages/member/ForgotPasswordPage/ForgotPasswordPage';
import ResetPasswordSentPage from './pages/member/ResetPasswordSentPage/ResetPasswordSentPage';
import EditProfilePage from './pages/member/EditProfilePage/EditProfilePage';
import SchedulePage from './pages/member/SchedulePage/SchedulePage';
import MyPackagesPage from './pages/member/MyPackagesPage/MyPackagesPage';
import ComplaintsPage from './pages/member/ComplaintsPage/ComplaintsPage';
import HomePage from './pages/member/HomePage/HomePage';
import NotFoundPage from './pages/NotFoundPage/NotFoundPage';

// Auth pages
import Login from './pages/auth/Login';

// Admin
import AdminLayout from './components/features/admin/AdminLayout';
import AdminDashboard from './pages/admin/Dashboard';
import AdminMembers from './pages/admin/Members';
import AdminEmployees from './pages/admin/Employees';
import AdminPackages from './pages/admin/Packages';
import AdminOrders from './pages/admin/Orders';
import AdminStatistics from './pages/admin/Statistics';
import AdminSettings from './pages/admin/Settings';
import AdminProfile from './pages/admin/Profile';
import AdminAccount from './pages/admin/Account';
import ViewMember from './pages/admin/ViewMember';
import EditMember from './pages/admin/EditMember';
import ViewEmployee from './pages/admin/ViewEmployee';
import EditEmployee from './pages/admin/EditEmployee';
import ViewPackage from './pages/admin/ViewPackage';
import EditPackage from './pages/admin/EditPackage';
import ViewOrder from './pages/admin/ViewOrder';
import EditOrder from './pages/admin/EditOrder';
import EditProfile from './pages/admin/EditProfile';
import AdminEquipment from './pages/admin/Equipment';
import AdminFeedback from './pages/admin/Feedback';
import AdminWorkouts from './pages/admin/Workouts';
import ViewEquipment from './pages/admin/ViewEquipment';
import EditEquipment from './pages/admin/EditEquipment';
import ViewFeedback from './pages/admin/ViewFeedback';
import ViewWorkout from './pages/admin/ViewWorkout';
import EditWorkout from './pages/admin/EditWorkout';
import EquipmentList from './pages/admin/EquipmentList';
import WorkoutList from './pages/admin/WorkoutList';
import AddMember from './pages/admin/AddMember';
import AddEmployee from './pages/admin/AddEmployee';
import AddPackage from './pages/admin/AddPackage';
import Promotions from './pages/admin/Promotions';
import AddPromotion from './pages/admin/AddPromotion';
import ViewPromotion from './pages/admin/ViewPromotion';
import EditPromotion from './pages/admin/EditPromotion';

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

// Staff
import StaffLayout from './components/layout/StaffLayout';
import StaffDashboard from './pages/staff/Dashboard';
import StaffMembers from './pages/staff/Members';
import StaffPackages from './pages/staff/Packages';
import StaffEquipment from './pages/staff/Equipment';
import StaffWorkouts from './pages/staff/Workouts';
import StaffSchedules from './pages/staff/Schedules';
import StaffFeedback from './pages/staff/Feedback';
import StaffAccount from './pages/staff/Account';
import StaffAddMember from './pages/staff/AddMember';
import StaffAddPackage from './pages/staff/AddPackage';
import AddEquipment from './pages/staff/AddEquipment';
import AddSchedule from './pages/staff/AddSchedule';
import StaffOrders from './pages/staff/Orders';
import ServiceHistory from './pages/staff/ServiceHistory';

// Trainer components
import TrainerLayout from './components/layout/TrainerLayout';
import TrainerDashboard from './pages/trainer/DashboardPage/DashboardPage';
import TrainerStudents from './pages/trainer/StudentsPage/StudentsPage';
import TrainerSchedulePage from './pages/trainer/SchedulePage/SchedulePage';
import TrainerWorkoutLogPage from './pages/trainer/WorkoutLogPage/WorkoutLogPage';
import ProgressPage from './pages/trainer/ProgressPage/ProgressPage';

import { AuthProvider } from './contexts/AuthContext';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
        {/* Đặt HomePage làm trang mặc định */}
          <Route path="/" element={<HomePage />} /> 
          <Route path="/login" element={<LoginPage />} />
          <Route path="/auth/login" element={<Login />} />
        
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

          {/* Member feature routes */}
          <Route path="/schedule" element={<SchedulePage />} />
          <Route path="/my-packages" element={<MyPackagesPage />} />
          <Route path="/notifications" element={<NotificationPage />} />
          <Route path="/complaints" element={<ComplaintsPage />} />
          <Route path="/profile/edit" element={<EditProfilePage />} />
          <Route path="/settings" element={<SettingsPage />} />
          
          {/* Other routes */}
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/members" element={<MemberManagement />} />
          <Route path="/equipment" element={<EquipmentManagement />} />
          <Route path="/packages" element={<PackageManagement />} />

          {/* Staff routes */}
          <Route element={<PrivateRoute allowedRoles={["staff"]} />}>
            <Route path="/staff" element={<StaffLayout />}>
              <Route path="dashboard" element={<StaffDashboard />} />
              <Route path="members" element={<StaffMembers />} />
              <Route path="members/add" element={<StaffAddMember />} />
              <Route path="packages" element={<StaffPackages />} />
              <Route path="packages/add" element={<StaffAddPackage />} />
              <Route path="equipment" element={<StaffEquipment />} />
              <Route path="orders" element={<StaffOrders />} />
              <Route path="workouts" element={<StaffWorkouts />} />
              <Route path="service-history" element={<ServiceHistory />} />
              <Route path="schedules" element={<StaffSchedules />} />
              <Route path="feedback" element={<StaffFeedback />} />
              <Route path="account" element={<StaffAccount />} />
            </Route>
          </Route>

          {/* Admin routes */}
          <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
          <Route element={<PrivateRoute allowedRoles={["admin"]} />}>
            <Route path="/admin" element={<AdminLayout />}>
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="members" element={<AdminMembers />} />
              <Route path="members/add" element={<AddMember />} />
              <Route path="members/view/:id" element={<ViewMember />} />
              <Route path="members/edit/:id" element={<EditMember />} />
              <Route path="employees" element={<AdminEmployees />} />
              <Route path="employees/add" element={<AddEmployee />} />
              <Route path="employees/view/:id" element={<ViewEmployee />} />
              <Route path="employees/edit/:id" element={<EditEmployee />} />
              <Route path="packages" element={<AdminPackages />} />
              <Route path="packages/add" element={<AddPackage />} />
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
              <Route path="feedback" element={<AdminFeedback />} />
              <Route path="feedback/view/:id" element={<ViewFeedback />} />
              <Route path="statistics" element={<AdminStatistics />} />
              <Route path="settings" element={<AdminSettings />} />
              <Route path="profile" element={<AdminProfile />} />
              <Route path="profile/edit" element={<EditProfile />} />
              <Route path="account" element={<AdminAccount />} />
              <Route path="promotions" element={<Promotions />} />
              <Route path="promotions/add" element={<AddPromotion />} />
              <Route path="promotions/view/:id" element={<ViewPromotion />} />
              <Route path="promotions/edit/:id" element={<EditPromotion />} />
            </Route>
          </Route>

          {/* Trainer routes */}
          <Route element={<PrivateRoute allowedRoles={["trainer"]} />}>
            <Route path="/trainer" element={<TrainerLayout />}>
              <Route index element={<Navigate to="/trainer/dashboard" replace />} />
              <Route path="dashboard" element={<TrainerDashboard />} />
              <Route path="students" element={<TrainerStudents />} />
              <Route path="schedule" element={<TrainerSchedulePage />} />
              <Route path="workouts" element={<TrainerWorkoutLogPage />} />
              <Route path="progress" element={<ProgressPage />} />
              <Route path="settings" element={<div>Cài đặt</div>} />
            </Route>
          </Route>

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
