import React, { Fragment, useEffect, useState } from "react";
import "./UpdatePassword.css";
import Loader from "../layout/Loader/Loader.js";
import { useSelector, useDispatch } from "react-redux";
import { updatePassword } from "../../actions/userAction";
import LockIcon from "@mui/icons-material/Lock";
import KeyIcon from "@mui/icons-material/Key";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import { toast } from "react-toastify";
import { UPDATE_PASSWORD_RESET } from "../../constants/userConstants";
import MetaData from "../layout/MetaData";
import passToText from '../layout/PassToggle'

const UpdatePassword = () => {
    const [oldPassInputType,oldIconToggle] = passToText()
    const [newPassInputType,newIconToggle] = passToText()
    const [confirmPassInputType,confirmIconToggle] = passToText()
  const { error, isUpdated, loading } = useSelector((state) => state.profile);
  const dispatch = useDispatch();

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const updatePasswordSubmit = (e) => {
    e.preventDefault();
    const myForm = new FormData();

    myForm.set("oldPassword", oldPassword);
    myForm.set("newPassword", newPassword);
    myForm.set("confirmPassword", confirmPassword);

    dispatch(updatePassword(myForm));
  };

  const errorAlert = (error, isCancelled) => {
    toast.error(error, {
      position: window.innerWidth < 600 ? "top-center" : "bottom-center",
      autoClose: 1500,
      hideProgressBar: isCancelled,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
  };
  

  useEffect(() => {
    let isCancelled = false;

    if (error) {
      isCancelled = false;
      errorAlert(error, isCancelled);
      return () => {
        isCancelled = true;
      };
    }
    if (isUpdated) {
      toast.success(`Password Changed Successfully`, {
        position: window.innerWidth < 600 ? "top-center" : "bottom-center",
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });

      dispatch({
        type: UPDATE_PASSWORD_RESET,
      });
    }
  }, [dispatch, error, isUpdated]);

  return (
    <Fragment>
      {loading ? (
        <Loader />
      ) : (
        
          <Fragment>
            <MetaData title={`Change Password`} />

            <div className="updatePasswordContainer flexCenterRow">
              <div className="updatePasswordBox">
                <h2 className="updatePasswordHeading">Update Password</h2>

                <form
                  className="updatePasswordForm flexCenterColumn"
                  encType="multipart/form-data"
                  onSubmit={updatePasswordSubmit}
                >
                  <div className="updatePassword">
                    <KeyIcon />
                    <input
                     type={oldPassInputType}
                      placeholder="Old Password"
                      required
                      value={oldPassword}
                      id="oldPassword"
                      autoComplete="on"
                      onChange={(e) => setOldPassword(e.target.value)}
                    />
                  <span className="eye">
                    {oldIconToggle}
                    </span>
                  </div>
                  <div className="updatePassword">
                    <LockOpenIcon />
                    <input
                      type={newPassInputType}
                      placeholder="New Password"
                      required
                      value={newPassword}
                      id="newPassword"
                      autoComplete="on"
                      onChange={(e) => setNewPassword(e.target.value)}
                    />
                    <span className="eye">
                    {newIconToggle}
                    </span>
                  </div>
                  <div className="updatePassword">
                    <LockIcon />
                    <input
                      type={confirmPassInputType}
                      placeholder="Confirm Password"
                      required
                      value={confirmPassword}
                      id="confirmPassword"
                      autoComplete="on"
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    <span className="eye">
                    {confirmIconToggle}
                    </span>
                    
                  </div>
                  <input
                    type="submit"
                    value="Change Password"
                    className="updatePasswordBtn"
                  />
                </form>
              </div>
            </div>
          </Fragment>
        
      )}
    </Fragment>
  );
};

export default UpdatePassword;
