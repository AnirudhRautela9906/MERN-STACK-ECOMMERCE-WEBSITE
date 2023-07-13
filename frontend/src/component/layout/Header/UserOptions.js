import React, { Fragment, useState,useEffect } from "react";
import "./Header.css";
import { SpeedDialAction, SpeedDial } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import PersonIcon from "@mui/icons-material/Person";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import ListAltIcon from "@mui/icons-material/ListAlt";
import DashboardIcon from "@mui/icons-material/Dashboard";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { logout } from "../../../actions/userAction";
import { Backdrop } from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";

const UserOptions = () => {
  const { user,error } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { cartItems } = useSelector((state) => state.cart);

  const options = [
    {
      icon: (
        <ShoppingCartIcon
          style={{ color: cartItems.length > 0 ? "tomato" : "unset" }}
        />
      ),
      tooltipTitle:
        cartItems.length === 0 ? "Cart" : `Cart Items(${cartItems.reduce(
          (accumulator,item)=> accumulator + item.quantity,0
      )})`,
      func: cartItemsfunc,
    },
    { icon: <ListAltIcon />, tooltipTitle: "Orders", func: orders },
    { icon: <PersonIcon />, tooltipTitle: "Profile", func: account },
    { icon: <ExitToAppIcon />, tooltipTitle: "Logout", func: logoutUser },
  ];

  if (user.role === "Admin") {
    options.unshift({
      icon: <DashboardIcon />,
      tooltipTitle: "Dashboard",
      func: dashboard,
    });
  }
  function dashboard() {
    navigate("/admin/dashboard");
  }
  function cartItemsfunc() {
    navigate("/cart");
  }
  function orders() {
    navigate("/orders");
  }
  function account() {
    navigate("/account");
  }
  function logoutUser() {
    dispatch(logout());
    setTimeout(() => {
      navigate("/login")
    }, 1000);
  }

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
      errorAlert(error, isCancelled);
      return () => {
        isCancelled = true;
      };
    }
},[navigate,error])
  return (
    <Fragment>
      <Backdrop open={open} style={{ zIndex: 10 }} />
      <SpeedDial
        className="speedDial"
        style={{ zIndex: 11 }}
        ariaLabel="SpeedDial tooltip example"
        onClose={() => setOpen(false)}
        onOpen={() => setOpen(true)}
        open={open}
        direction="down"
        icon={
          <img
            className="speedDialIcon"
            src={user.avatar.url ? user.avatar.url : "/logo512.png"}
            alt="Profile"
          />
        }
      >
        {options.map((item) => (
          <SpeedDialAction
            key={item.tooltipTitle}
            icon={item.icon}
            tooltipTitle={item.tooltipTitle}
            onClick={item.func}
            tooltipOpen={window.innerWidth < 600 ? true : false}
          />
        ))}
      </SpeedDial>
    </Fragment>
  );
};

export default UserOptions;
