import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate
} from "react-router-dom";
import Sidebar from "./components/Sidebar.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Members from "./pages/Members.jsx";
import Employees from "./pages/Employees.jsx";
import Packages from "./pages/Packages.jsx";
import Orders from "./pages/Orders.jsx";
import Account from "./pages/Account.jsx";
import Header from "./components/Header.jsx";
import ViewMember from "./pages/ViewMember.jsx";
import EditMember from "./pages/EditMember.jsx";
import ViewEmployee from "./pages/ViewEmployee.jsx";
import EditEmployee from "./pages/EditEmployee.jsx";
import ViewPackage from "./pages/ViewPackage.jsx";
import EditPackage from "./pages/EditPackage.jsx";
import ViewOrder from "./pages/ViewOrder.jsx";
import EditOrder from "./pages/EditOrder.jsx";
import EditProfile from "./pages/EditProfile";
import { HiOutlineTrash } from "react-icons/hi";

function App() {
  return (
    <Router>
      <div className="flex min-h-screen bg-gray-100">
        <Sidebar />
        <div className="flex-1 p-6">
          <Header />
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/members" element={<Members />} />
            <Route path="/employees" element={<Employees />} />
            <Route path="/packages" element={<Packages />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/account" element={<Account />} />
            <Route path="/members/view/:id" element={<ViewMember />} />
            <Route path="/members/edit/:id" element={<EditMember />} />
            <Route path="/employees/view/:id" element={<ViewEmployee />} />
            <Route path="/employees/edit/:id" element={<EditEmployee />} />
            <Route path="/packages/view/:id" element={<ViewPackage />} />
            <Route path="/packages/edit/:id" element={<EditPackage />} />
            <Route path="/orders/view/:id" element={<ViewOrder />} />
            <Route path="/orders/edit/:id" element={<EditOrder />} />
            <Route path="/profile/edit" element={<EditProfile />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
