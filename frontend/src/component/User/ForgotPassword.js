import React, { Fragment, useEffect, useState } from "react";
import "./ForgotPassword.css";
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import Loader from "../layout/Loader/Loader.js";
import { useSelector, useDispatch } from "react-redux";
import { forgotPassword } from "../../actions/userAction";
import { toast } from "react-toastify";
import MetaData from "../layout/MetaData";

const ForgotPassword = () => {
    const {error,message,loading} = useSelector((state) => state.forgotPassword)
    const dispatch = useDispatch()
   const [email,setEmail] = useState("")

const forgotPasswordSubmit = (e)=>{
    e.preventDefault()
    dispatch(forgotPassword(email))
}
 
const errorAlert = (error,isCancelled)=>{
    toast.error(error, {
        position:window.innerWidth < 600 ? "top-center" :"bottom-center" ,
        autoClose: 1500,
        hideProgressBar: isCancelled,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        });;
  }

useEffect(() => {
    let isCancelled = false
     if(message){
    toast.success(message, {
        position: window.innerWidth < 600 ? "top-center" :"bottom-center",
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        });;
  }
 else if(error)  {
    errorAlert(error,isCancelled)
   return ()=>{isCancelled = true}
}
// eslint-disable-next-line react-hooks/exhaustive-deps
}, [dispatch,error,message])

  return (
    <Fragment>
      {loading ? (
        <Loader />
      ) : (
        <Fragment>
          <MetaData title={`Forgot Password`} />

          <div className="forgotPasswordContainer flexCenterRow">
            <div className="forgotPasswordBox">
              <h2 className="forgotPasswordHeading">Forgot Password</h2>

              <form
                className="forgotPasswordForm flexCenterColumn"
                encType="multipart/form-data"
                onSubmit={forgotPasswordSubmit}
              >
                <div className="forgotPassword">
                  <MailOutlineIcon />
                  <input
                    type="email"
                    placeholder="Email"
                    required
                    value={email}
                    id="confirmPassword"
                    autoComplete="on"
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <input
                  type="submit"
                  value="Send"
                  className="forgotPasswordBtn"
                />
              </form>
            </div>
          </div>
        </Fragment>
      )}
    </Fragment>
  );
};

export default ForgotPassword;
