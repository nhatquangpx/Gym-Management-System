import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

const PrivateRoute = ({ allowedRoles }) => {
  const auth = useSelector((state) => state.auth);
  const { user, token, isLoggedIn } = auth;
  
  // Check for user and token in localStorage as fallback
  const localToken = localStorage.getItem("token");
  let localUser;
  
  try {
    const userStr = localStorage.getItem("user");
    localUser = userStr ? JSON.parse(userStr) : null;
  } catch (error) {
    console.error("Error parsing user from localStorage:", error);
    localUser = null;
  }
  
  // Determine effective authentication state and role
  const effectiveIsLoggedIn = isLoggedIn || !!localToken;
  const effectiveUser = user || localUser;
  const effectiveRole = effectiveUser?.role;
  
  console.log("PrivateRoute - isLoggedIn:", effectiveIsLoggedIn);
  console.log("PrivateRoute - role:", effectiveRole);

  // Redirect to login if not logged in
  if (!effectiveIsLoggedIn) {
    return <Navigate to="/auth/login" replace />;
  }

  // Redirect to home if role is not allowed
  if (allowedRoles && (!effectiveRole || !allowedRoles.includes(effectiveRole))) {
    console.log("Access denied - Role not allowed:", effectiveRole);
    return <Navigate to="/auth/login" replace />;
  }

  // Allow access to the protected route
  return <Outlet />;
};

export default PrivateRoute;