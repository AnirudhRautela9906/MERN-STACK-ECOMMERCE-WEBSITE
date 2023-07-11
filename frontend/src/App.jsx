import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import WebFont from "webfontloader";
import "./App.css";
import Header from "./component/layout/Header/Header.js";
import Footer from "./component/layout/Footer/footer.js";
import React, { useEffect } from "react";
import Home from "./component/Home/Home.js";
import ProductDetails from "./component/Product/ProductDetails.js";
import Products from "./component/Product/Products.js";
import Search from "./component/Product/Search.js";
import LoginSignup from "./component/User/LoginSignUp";
import Profile from "./component/User/Profile.js";
import store from "./store";
import { loadUser } from "./actions/userAction";
import UserOptions from "./component/layout/Header/UserOptions.js";
import { useSelector } from "react-redux";
import ProtectedRoute from "./component/Route/ProtectedRoute";
import AdminRoute from "./component/Route/AdminRoute.js";
import UpdateProfile from "./component/User/UpdateProfile.js";
import UpdatePassword from "./component/User/UpdatePassword.js";
import NotFound from "./component/layout/NotFound.js";
import ForgotPassword from "./component/User/ForgotPassword.js";
import ResetPassword from "./component/User/ResetPassword.js";
import Cart from "./component/Cart/Cart.js";
import Shipping from "./component/Cart/Shipping.js";
import ConfirmOrder from "./component/Cart/ConfirmOrder.js";
import StripeWrap from "./component/Cart/StripeWrap.js";
import OrderSuccess from "./component/Cart/OrderSuccess.js";
import MyOrders from "./component/Order/MyOrders.js";
import OrderDetails from "./component/Order/OrderDetails.js";
import Dashboard from "./component/Admin/Dashboard.js";
import ProductList from "./component/Admin/ProductList.js";
import NewProduct from "./component/Admin/NewProduct";
import UpdateProduct from "./component/Admin/UpdateProduct";
import UpdateOrder from "./component/Admin/UpdateOrder.js";
import Orders from "./component/Admin/Orders";
import Users from "./component/Admin/Users";
import UpdateUser from "./component/Admin/UpdateUser";
import ProductReviews from "./component/Admin/ProductReviews";
import About from "./component/layout/About/About";
import Contact from "./component/layout/Contact/Contact";

function App() {
  const { isAuthenticated, user } = useSelector((state) => state.user);

  useEffect(() => {
    WebFont.load({
      google: {
        families: ["Roboto", "Open Sans", "Chilanka"],
      },
    });
    store.dispatch(loadUser());
  }, []);

  window.addEventListener("contextmenu", (e)=>e.preventDefault())


  return (
    <Router>
      <Header />
      {isAuthenticated && <UserOptions user={user} />}
      <Routes>
        <Route path="/" Component={Home} />
        <Route path="*" element={<NotFound text={"Page Not Found"} />} />
        <Route path="/product/:id" Component={ProductDetails} />
        <Route path="/products" Component={Products} />
        <Route path="/products/:keyword" Component={Products} />
        <Route path="/search" Component={Search} />
        <Route path="/login" Component={LoginSignup} />
        <Route path="/forgot_password" Component={ForgotPassword} />
        <Route path="/reset_password/:token" Component={ResetPassword} />
        <Route path="/cart" Component={Cart} />
        <Route path="/contact" Component={Contact} />
        <Route path="/about" Component={About} />

        {isAuthenticated && (
          <Route element={<ProtectedRoute />}>
            <Route path="/account" Component={Profile} />
            <Route path="/profile_update" Component={UpdateProfile} />
            <Route path="/password_update" Component={UpdatePassword} />
            <Route path="/shipping" Component={Shipping} />
            <Route path="/order/confirm" Component={ConfirmOrder} />
            <Route path="/process/payment" Component={StripeWrap} />
            <Route path="/success" Component={OrderSuccess} />
            <Route path="/orders" Component={MyOrders} />
            <Route path="/order/:id" Component={OrderDetails} />
            <Route element={<AdminRoute />}>
              <Route path="/admin/dashboard" Component={Dashboard} />
              <Route path="/admin/products" Component={ProductList} />
              <Route path="/admin/product" Component={NewProduct} />
              <Route path="/admin/product/:id" Component={UpdateProduct} />
              <Route path="/admin/orders" Component={Orders} />
              <Route path="/admin/order/:id" Component={UpdateOrder} />
              <Route path="/admin/users" Component={Users} />
              <Route path="/admin/user/:id" Component={UpdateUser} />
              <Route path="/admin/reviews" Component={ProductReviews} />
            </Route>
          </Route>
        )}
      </Routes>
      <Footer />
      {/* <Route
        path="/account"
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <Profile />
          </ProtectedRoute>
        }
      /> */}
    </Router>
  );
}

export default App;
