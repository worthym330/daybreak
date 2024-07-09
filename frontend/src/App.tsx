import {
  BrowserRouter as Router,
  Route,
  Routes,
  useNavigate,
  useLocation,
} from "react-router-dom";
import Layout from "./layouts/Layout";
import Register from "./pages/Register";
import SignIn from "./pages/SignIn";
import MyHotels from "./pages/MyHotels";
import Search from "./pages/Search";
import Detail from "./pages/Detail";
import Booking from "./pages/Booking";
import MyBookings from "./pages/MyBookings";
import Home from "./pages/Home";
import { NotFound } from "./pages/NotFound";
import Cookies from "js-cookie";
import { useEffect } from "react";
import WaitList from "./pages/WaitList";
import AboutUs from "./pages/AboutUs";
import TermsAndConditions from "./pages/TermAndCondition";
import PrivacyPolicy from "./pages/PrivacyandPolicy";
import Support from "./pages/Support";
import CookiePolicy from "./pages/CookiePolicy";
import Login from "./pages/LoginandSignup";
import { Bounce, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CancellationPolicy from "./pages/CancellationPolicy";
import ResetPass from "./pages/ResetPassword";
import Contact from "./pages/ContactUs";

const AccessControl = ({ children, requiredRoles }: any) => {
  const auth_token = Cookies.get("authentication") || "null";
  const user = JSON.parse(auth_token);
  const navigate = useNavigate();
  // const [unauthenticated, setUnauthenticated] = useState(false);
  useEffect(() => {
    if (user === null) {
      navigate(-1);
    } else if (requiredRoles && !requiredRoles.includes(user.role)) {
      navigate("/");
    }
  }, [user, requiredRoles, navigate]);

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

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const App = () => {
  return (
    <Router>
      <ScrollToTop />
      <ToastContainer
        position="top-center"
        autoClose={1000}
        transition={Bounce}
      />
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
        <Route
          path="/cancellation-policy"
          element={
            <Layout>
              <CancellationPolicy />
            </Layout>
          }
        />
        <Route path="/about-us" element={<AboutUs />} />
        <Route
          path="/contact-us"
          element={
            <Layout>
              <Contact />
            </Layout>
          }
        />
        <Route
          path="/register"
          element={
            <AuthRedirect>
              {/* <Layout> */}
              <Login Login={false} />
              {/* </Layout> */}
            </AuthRedirect>
          }
        />
        <Route
          path="/login"
          element={
            <AuthRedirect>
              {/* <Layout> */}
              <Login Login={true} />
              {/* </Layout> */}
            </AuthRedirect>
          }
        />
        <Route path="/waitlist" element={<WaitList />} />
        <Route
          path="/checkout"
          element={
            // <AccessControl requiredRoles={["customer"]}>
            <Layout>
              <Booking />
            </Layout>
            // </AccessControl>
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
        <Route
          path="/reset-password/:token"
          element={
            <Layout>
              <ResetPass />
            </Layout>
          }
        />
        <Route
          path="/review/:hotelId"
          element={
            <Layout>
              <ResetPass />
            </Layout>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
