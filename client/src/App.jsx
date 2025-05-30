import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import PrivateRoute from './components/PrivateRoute';
import { useEffect } from 'react';
import { checkAuthStatus } from './utils/authUtils';

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
import AdminViewMember from './pages/admin/ViewMember';
import AdminEditMember from './pages/admin/EditMember';
import AdminViewEmployee from './pages/admin/ViewEmployee';
import AdminEditEmployee from './pages/admin/EditEmployee';
import AdminAddEmployee from './pages/admin/AddEmployee';
import AdminViewPackage from './pages/admin/ViewPackage';
import AdminEditPackage from './pages/admin/EditPackage';
import AdminViewOrder from './pages/admin/ViewOrder';
import AdminEditOrder from './pages/admin/EditOrder';
import AdminEditProfile from './pages/admin/EditProfile';
import AdminEquipment from './pages/admin/Equipment';
import AdminFeedback from './pages/admin/Feedback';
import AdminWorkouts from './pages/admin/Workouts';
import AdminViewEquipment from './pages/admin/ViewEquipment';
import AdminEditEquipment from './pages/admin/EditEquipment';
import AdminViewFeedback from './pages/admin/ViewFeedback';
import AdminViewWorkout from './pages/admin/ViewWorkout';
import AdminEditWorkout from './pages/admin/EditWorkout';
import AdminEquipmentList from './pages/admin/EquipmentList';
import AdminWorkoutList from './pages/admin/WorkoutList';
import AdminAddMember from './pages/admin/AddMember';
import AdminAddPackage from './pages/admin/AddPackage';
import AdminPromotions from './pages/admin/Promotions';
import AdminAddPromotion from './pages/admin/AddPromotion';
import AdminViewPromotion from './pages/admin/ViewPromotion';
import AdminEditPromotion from './pages/admin/EditPromotion';
import AdminTrainers from './pages/admin/Trainers';
import AdminAddTrainer from './pages/admin/AddTrainer';
import AdminViewTrainer from './pages/admin/ViewTrainer';
import AdminEditTrainer from './pages/admin/EditTrainer';

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
import StaffAddEquipment from './pages/staff/AddEquipment';
import StaffAddSchedule from './pages/staff/AddSchedule';
import StaffOrders from './pages/staff/Orders';
import StaffServiceHistory from './pages/staff/ServiceHistory';
import StaffWorkoutLogPage from './pages/staff/WorkoutLogPage';

// Trainer components
import TrainerLayout from './components/layout/TrainerLayout';
import TrainerDashboard from './pages/trainer/DashboardPage/DashboardPage';
import TrainerStudents from './pages/trainer/StudentsPage/StudentsPage';
import TrainerSchedulePage from './pages/trainer/SchedulePage/SchedulePage';
import TrainerWorkoutLogPage from './pages/trainer/WorkoutLogPage/WorkoutLogPage';
import ProgressPage from './pages/trainer/ProgressPage/ProgressPage';

function App() {
  // Kiểm tra trạng thái xác thực khi ứng dụng khởi động
  useEffect(() => {
    checkAuthStatus();
  }, []);

  return (
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
        <Route element={<PrivateRoute allowedRoles={["employee"]} />}>
          <Route path="/staff" element={<StaffLayout />}>
            <Route path="dashboard" element={<StaffDashboard />} />
            <Route path="members" element={<StaffMembers />} />
            <Route path="members/add" element={<StaffAddMember />} />
            <Route path="packages" element={<StaffPackages />} />
            <Route path="packages/add" element={<StaffAddPackage />} />
            <Route path="equipment" element={<StaffEquipment />} />
            <Route path="equipment/add" element={<StaffAddEquipment />} />
            <Route path="orders" element={<StaffOrders />} />
            <Route path="workouts" element={<StaffWorkouts />} />
            <Route path="service-history" element={<StaffServiceHistory />} />
            <Route path="schedules" element={<StaffSchedules />} />
            <Route path="schedules/add" element={<StaffAddSchedule />} />
            <Route path="feedback" element={<StaffFeedback />} />
            <Route path="account" element={<StaffAccount />} />
            <Route path="workout-log" element={<StaffWorkoutLogPage />} />
          </Route>
        </Route>

        {/* Admin routes */}
        <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
        <Route element={<PrivateRoute allowedRoles={["admin"]} />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="members" element={<AdminMembers />} />
            <Route path="members/add" element={<AdminAddMember />} />
            <Route path="members/view/:id" element={<AdminViewMember />} />
            <Route path="members/edit/:id" element={<AdminEditMember />} />
            <Route path="employees" element={<AdminEmployees />} />
            <Route path="employees/add" element={<AdminAddEmployee />} />
            <Route path="employees/view/:id" element={<AdminViewEmployee />} />
            <Route path="employees/edit/:id" element={<AdminEditEmployee />} />
            <Route path="packages" element={<AdminPackages />} />
            <Route path="packages/add" element={<AdminAddPackage />} />
            <Route path="packages/view/:id" element={<AdminViewPackage />} />
            <Route path="packages/edit/:id" element={<AdminEditPackage />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="orders/view/:id" element={<AdminViewOrder />} />
            <Route path="orders/edit/:id" element={<AdminEditOrder />} />
            <Route path="equipment" element={<AdminEquipmentList />} />
            <Route path="equipment/view/:id" element={<AdminViewEquipment />} />
            <Route path="equipment/edit/:id" element={<AdminEditEquipment />} />
            <Route path="equipment/add" element={<AdminEditEquipment />} />
            <Route path="workouts" element={<AdminWorkoutList />} />
            <Route path="workouts/view/:id" element={<AdminViewWorkout />} />
            <Route path="workouts/edit/:id" element={<AdminEditWorkout />} />
            <Route path="workouts/add" element={<AdminEditWorkout />} />
            <Route path="feedback" element={<AdminFeedback />} />
            <Route path="feedback/view/:id" element={<AdminViewFeedback />} />
            <Route path="statistics" element={<AdminStatistics />} />
            <Route path="settings" element={<AdminSettings />} />
            <Route path="profile" element={<AdminProfile />} />
            <Route path="profile/edit" element={<AdminEditProfile />} />
            <Route path="account" element={<AdminAccount />} />
            <Route path="promotions" element={<AdminPromotions />} />
            <Route path="promotions/add" element={<AdminAddPromotion />} />
            <Route path="promotions/view/:id" element={<AdminViewPromotion />} />
            <Route path="promotions/edit/:id" element={<AdminEditPromotion />} />
            <Route path="trainers" element={<AdminTrainers />} />
            <Route path="trainers/add" element={<AdminAddTrainer />} />
            <Route path="trainers/view/:id" element={<AdminViewTrainer />} />
            <Route path="trainers/edit/:id" element={<AdminEditTrainer />} />
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
  );
}

export default App;
