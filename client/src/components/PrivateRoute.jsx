import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const PrivateRoute = ({ allowedRoles }) => {
  const { isLoggedIn, user } = useAuth();
  
  // Check for user in localStorage if not in context
  const localUser = JSON.parse(localStorage.getItem("user") || "{}");
  
  // Determine effective authentication state and role
  const effectiveIsLoggedIn = isLoggedIn || !!localUser?.id;
  const effectiveRole = user?.role || localUser?.role;
  
  console.log("PrivateRoute - isLoggedIn:", effectiveIsLoggedIn);
  console.log("PrivateRoute - role:", effectiveRole);

  // Redirect to login if not logged in
  if (!effectiveIsLoggedIn) {
    return <Navigate to="/auth/login" replace />;
  }

  // Redirect to home if role is not allowed
  if (allowedRoles && (!effectiveRole || !allowedRoles.includes(effectiveRole))) {
    return <Navigate to="/" replace />;
  }

  // Allow access to the protected route
  return <Outlet />;
};

export default PrivateRoute; 