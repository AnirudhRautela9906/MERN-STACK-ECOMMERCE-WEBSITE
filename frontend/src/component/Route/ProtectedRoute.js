import { Navigate, Outlet } from 'react-router-dom'
import { useSelector } from "react-redux";
import Fragment  from 'react';
import Loader from '../layout/Loader/Loader';
const ProtectedRoute = () => {
  const {  isAuthenticated,loading } = useSelector((state) => state.user);

  //  if (isAuthenticated === true) { return <Outlet/>  }
  //   else { return <Navigate to="/login" />}
  
  return(
    <>
      {
        loading ? <Loader/> :
        ((isAuthenticated === true && <Outlet/>) ||  (isAuthenticated === false &&   <Navigate to="/login" />))
      }
    </>
  )
};
  

export default ProtectedRoute;
