import { Navigate, Outlet } from 'react-router-dom'
import { useSelector } from "react-redux";

const ProtectedRoute = () => {
  const {  isAuthenticated } = useSelector((state) => state.user);

 if (isAuthenticated === true) { return <Outlet/>  }
  else { return <Navigate to="/login" />}

  
};

export default ProtectedRoute;
