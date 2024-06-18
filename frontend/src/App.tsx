import {
  BrowserRouter as Router,
  Route,
  Routes,
  useNavigate,
} from "react-router-dom";
import Layout from "./layouts/Layout";
import Register from "./pages/Register";
import SignIn from "./pages/SignIn";
import AddHotel from "./pages/AddHotel";
import MyHotels from "./pages/MyHotels";
import EditHotel from "./pages/EditHotel";
import Search from "./pages/Search";
import Detail from "./pages/Detail";
import Booking from "./pages/Booking";
import MyBookings from "./pages/MyBookings";
import Home from "./pages/Home";
import { NotFound } from "./pages/NotFound";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import WaitList from "./pages/WaitList";
import AboutUs from "./pages/AboutUs";
import TermsAndConditions from "./pages/TermAndCondition";
import PrivacyPolicy from "./pages/PrivacyandPolicy";
import Support from "./pages/Support";
import CookiePolicy from "./pages/CookiePolicy";
import Login from "./pages/LoginandSignup";

const AccessControl = ({ children, requiredRoles }: any) => {
  const auth_token = Cookies.get("authentication") || "null";
  const user = JSON.parse(auth_token);
  const navigate = useNavigate();
  const [unauthenticated, setUnauthenticated] = useState(false);
  useEffect(() => {
    if (user === null) {
      setUnauthenticated(true);
      setTimeout(() => {
        navigate(-1);
      }, 3000);
    } else if (requiredRoles && !requiredRoles.includes(user.role)) {
      navigate("/");
    }
  }, [user, requiredRoles, navigate]);

  if (user === null || (requiredRoles && !requiredRoles.includes(user.role))) {
    return (
      <>
        {unauthenticated && (
          <div className="fixed top-4 right-0 transform -translate-x-1/2 bg-red-500 text-white p-4 rounded shadow-lg">
            Please login and try again.
          </div>
        )}
      </>
    );
  }

  return <>{children}</>;
};

const AuthRedirect = ({ children }: any) => {
  const auth_token = Cookies.get("authentication");
  const navigate = useNavigate();

  useEffect(() => {
    if (auth_token) {
      navigate("/"); // Redirect to home or any other page
    }
  }, [auth_token]);

  return auth_token ? null : children;
};

const App = () => {
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <Layout>
              <Home />
            </Layout>
          }
        />
        <Route
          path="/search"
          element={
            <Layout>
              <Search />
            </Layout>
          }
        />
        <Route
          path="/detail/:hotelId"
          element={
            <Layout>
              <Detail />
            </Layout>
          }
        />
        <Route
          path="/hotel/name/:name"
          element={
            <Layout>
              <Detail />
            </Layout>
          }
        />
        <Route
          path="/partner/register"
          element={
            <AuthRedirect>
              <Register />
            </AuthRedirect>
          }
        />
        <Route
          path="/partner/sign-in"
          element={
            <AuthRedirect>
              <SignIn />
            </AuthRedirect>
          }
        />
        <Route
          path="/terms-and-condition"
          element={
            <Layout>
              <TermsAndConditions />
            </Layout>
          }
        />
        <Route
          path="/privacy-and-policy"
          element={
            <Layout>
              <PrivacyPolicy />
            </Layout>
          }
        />
        <Route
          path="/support"
          element={
            <Layout>
              <Support />
            </Layout>
          }
        />
        <Route
          path="/cookie-policy"
          element={
            <Layout>
              <CookiePolicy />
            </Layout>
          }
        />
        <Route path="/about-us" element={<AboutUs />} />
        <Route
          path="/register"
          element={
            <AuthRedirect>
              <Layout>
                <Login Login={false} />
              </Layout>
            </AuthRedirect>
          }
        />
        <Route
          path="/login"
          element={
            <AuthRedirect>
              <Layout>
                <Login Login={true} />
              </Layout>
            </AuthRedirect>
          }
        />
        <Route path="/waitlist" element={<WaitList />} />
        <Route
          path="/hotel/:hotelId/booking"
          element={
            <AccessControl requiredRoles={["customer"]}>
              <Layout>
                <Booking />
              </Layout>
            </AccessControl>
          }
        />

        <Route
          path="/add-hotel"
          element={
            <AccessControl requiredRoles={["partner"]}>
              <Layout>
                <AddHotel />
              </Layout>
            </AccessControl>
          }
        />
        <Route
          path="/edit-hotel/:hotelId"
          element={
            <AccessControl requiredRoles={["partner"]}>
              <Layout>
                <EditHotel />
              </Layout>
            </AccessControl>
          }
        />
        <Route
          path="/my-hotels"
          element={
            <AccessControl requiredRoles={["partner"]}>
              <Layout>
                <MyHotels />
              </Layout>
            </AccessControl>
          }
        />
        <Route
          path="/my-bookings"
          element={
            <AccessControl requiredRoles={["customer"]}>
              <Layout>
                <MyBookings />
              </Layout>
            </AccessControl>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};

export default App;
