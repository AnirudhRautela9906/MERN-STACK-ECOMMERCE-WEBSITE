import React from 'react'
import {ReactNavbar} from "overlay-navbar"
import {AiOutlineSearch, AiOutlineUser,AiOutlineShoppingCart} from "react-icons/ai"
import logo from "../../../images/logo.png"
const options = {
  logo:logo,
  logoWidth: "20vmax",
  navColor1: "#ffefef",
  // background-image: linear-gradient(136deg, rgb(242, 113, 33) 0%, rgb(233, 64, 87) 50%, rgb(138, 35, 135) 100%)
  logoHoverSize: "10px",
  logoHoverColor: "#eb4034",
  link1Text: "Home",
  link2Text: "Products",
  link3Text: "Contact",
  link4Text: "About",
  link1Url: "/",
  link2Url: "/products",
  link3Url: "/contact",
  link4Url: "/about",
  link1Size: "1.3vmax",
  link1Color: "rgba(35, 35, 35,0.8)",
  nav1justifyContent: "flex-end",
  nav2justifyContent: "flex-end",
  nav3justifyContent: "flex-start",
  nav4justifyContent: "flex-start",
  link1ColorHover: "#eb4034",
  link1Margin: "40px",
  profileIconMargin:"20px",
  searchIconMargin:"20px",
  cartIconMargin:"20px",
  profileIcon:true,
  searchIcon:true,
  cartIcon:true,
  SearchIconElement:AiOutlineSearch,
  ProfileIconElement:AiOutlineUser,
  CartIconElement:AiOutlineShoppingCart,
  profileIconColor: "rgba(35, 35, 35,0.8)",
  searchIconColor: "rgba(35, 35, 35,0.8)",
  cartIconColor: "rgba(35, 35, 35,0.8)",
  profileIconColorHover: "#eb4034",
  searchIconColorHover: "#eb4034",
  cartIconColorHover: "#eb4034",
  profileIconUrl: "/login",
  searchIconUrl:"/search",
  cartIconUrl: "/cart",
};

const Header = () => {
  return <ReactNavbar {...options} />;
};


export default Header