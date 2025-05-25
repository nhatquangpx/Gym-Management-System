import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

const PrivateRoute = ({ allowedRoles }) => {
  const auth = useSelector((state) => state.auth);
  const { user, token, isLoggedIn } = auth;
  
  // Check for user in localStorage as fallback
  const localUser = JSON.parse(localStorage.getItem("user") || "{}");
  const localToken = localStorage.getItem("token");
  
  // Determine effective authentication state and role
  const effectiveIsLoggedIn = isLoggedIn || !!localToken;
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