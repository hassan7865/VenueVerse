import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

import Header from "./Components/Header";
import Footer from "./Components/Footer";
import Sidebar from "./Components/Shop/sidebar";

import Login from "./Pages/Login";
import Home from "./Pages/Home";
import ListingPage from "./Pages/ListingPage";
import ProductDetails from "./Pages/ProductPage";
import Search from "./Pages/Search";
import ShopSearch from "./Pages/SearchShopItem";
import Shop from "./Pages/Shop";
import UserProfileCatalogue from "./Pages/UserProfile";
import UserOrdersPage from "./Pages/Order";
import UserBookingsPage from "./Pages/UserBooking";
import SuccessPage from "./Pages/OrderSuccessfull";
import Dashboard from "./Pages/Dashboard";
import ProfilePage from "./Pages/Profile";
import CreatePost from "./Pages/CreatePost";
import UpdatePost from "./Pages/UpdatePost";
import CreateDecorItem from "./Pages/CreateShopItem";
import UpdateDecorItem from "./Pages/UpdateShopItem";
import PrivateRoute from "./Components/PrivateRoute";
import MyListing from "./Pages/MyListing";
import ScrollToTop from "./Components/ScrollToTop";

// Move this outside the component to avoid reinitializing
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

function App() {
  return (
    <BrowserRouter>
     <ScrollToTop />
      <Header />

      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/listing/:id" element={<ListingPage />} />
        <Route path="/item/:id" element={<ProductDetails />} />
        <Route path="/search" element={<Search />} />
        <Route path="/search_shop" element={<ShopSearch />} />
        <Route path="/userprofile/:userId" element={<UserProfileCatalogue />} />
        <Route path="/shop" element={<Shop />} />

        {/* Private Routes */}
        <Route element={<PrivateRoute />}>
          <Route path="/mylisting" element={<MyListing />} />
          <Route path="/order" element={<UserOrdersPage />} />
          <Route path="/bookings" element={<UserBookingsPage />} />
          <Route path="/create_post" element={<CreatePost />} />
          <Route path="/update_post/:id" element={<UpdatePost />} />
          <Route path="/create_shopitem" element={<CreateDecorItem />} />
          <Route path="/update_shopitem/:id" element={<UpdateDecorItem />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/shop-success" element={<SuccessPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>
      </Routes>

      <Footer />

      <Toaster position="top-right" reverseOrder={false} />

      {/* Only wrap Stripe-enabled components inside <Elements> */}
      <Elements stripe={stripePromise}>
        <Sidebar />
      </Elements>
    </BrowserRouter>
  );
}

export default App;
