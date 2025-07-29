import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import Login from "./Pages/Login";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Header from "./Components/Header";
import Home from "./Pages/Home";
import PrivateRoute from "./Components/PrivateRoute";
import CreatePost from "./Pages/CreatePost";
import ListingPage from "./Pages/ListingPage";
import UpdatePost from "./Pages/UpdatePost";
import Search from "./Pages/Search";
import { Toaster } from "react-hot-toast";
import UserBookingsPage from "./Pages/UserBooking";
import Shop from "./Pages/Shop";
import CreateDecorItem from "./Pages/CreateShopItem";
import UpdateDecorItem from "./Pages/UpdateShopItem";
import ProductDetails from "./Pages/ProductPage";
import UserProfileCatalogue from "./Pages/UserProfile";
import Sidebar from "./Components/Shop/sidebar";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import MyListing from "./Pages/mylisting";
import ProfilePage from "./Pages/Profile";
import ShopSearch from "./Pages/SearchShopItem";
import UserOrdersPage from "./Pages/Order";
import SuccessPage from "./Pages/OrderSuccessfull";
import Dashboard from "./Pages/Dashboard";

function App() {
  const stripePromise = loadStripe(
    "pk_test_51RpWfK7VXE97ki7VAutJgGxO4ELKW9Z7LbkdtICovMZ176hEgRKNglYChD9Jwj32ch0mxx9bFamZht7WaBOfVtWK00H2le7mN5"
  );

  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/listing/:id" element={<ListingPage />} />
        <Route path="/item/:id" element={<ProductDetails />} />
        <Route path="/search?" element={<Search />} />
        <Route path="/search_shop?" element={<ShopSearch />} />
        <Route path="/userprofile/:userId" element={<UserProfileCatalogue />} />
        <Route path="/shop" element={<Shop />} />
        /---------Private Routes-----------/
        <Route element={<PrivateRoute />}>
          <Route path="/mylisting" element={<MyListing />} />
          <Route path="/order" element={<UserOrdersPage />} />
          <Route path="/bookings" element={<UserBookingsPage />} />
          <Route path="/create_post" element={<CreatePost />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/update_post/:id" element={<UpdatePost />} />
          <Route path="/create_shopitem" element={<CreateDecorItem />} />
          <Route path="/update_shopitem/:id" element={<UpdateDecorItem />} />
          <Route path="/shop-success?" element={<SuccessPage />} />
          <Route path="/dashboard" element={<Dashboard/>}/>
        </Route>
      </Routes>

      <Toaster position="top-right" reverseOrder={false} />
      <Elements stripe={stripePromise}>
        <Sidebar />
      </Elements>
    </BrowserRouter>
  );
}

export default App;
